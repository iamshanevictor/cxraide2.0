"""Characterize the prediction route without Flask, Pillow, Torch or model weights.

The route function is loaded from its AST and supplied synthetic boundary doubles.
This tests route decisions, not image decoding, real inference or Flask integration.
"""

import ast
import base64
import contextlib
import io
from pathlib import Path
import unittest


ROUTE_SOURCE = Path(__file__).resolve().parents[1] / "model_service.py"


class SyntheticImage:
    mode = "RGB"

    def copy(self):
        return self

    def save(self, buffer, format):
        assert format == "PNG"
        buffer.write(b"synthetic-png")


class SyntheticImageModule:
    @staticmethod
    def open(_):
        return SyntheticImage()


class SyntheticTensor:
    def unsqueeze(self, dimension):
        assert dimension == 0
        return self


class SyntheticFile:
    filename = "synthetic.png"

    @staticmethod
    def read():
        return b"synthetic-input"


class SyntheticRequest:
    method = "POST"

    def __init__(self, model_type):
        self.files = {"image": SyntheticFile()}
        self.form = {"model_type": model_type}


class SyntheticModel:
    def __init__(self):
        self.calls = 0

    def __call__(self, _):
        self.calls += 1
        return [{"boxes": [], "scores": [], "labels": []}]


class QuietLogger:
    def __getattr__(self, _):
        return lambda *args, **kwargs: None


def load_function(name, globals_for_route):
    """Execute an unchanged route function without importing unavailable packages."""
    module = ast.parse(ROUTE_SOURCE.read_text(encoding="utf-8"))
    route = next(node for node in module.body if isinstance(node, ast.FunctionDef) and node.name == name)
    route.decorator_list = []
    namespace = dict(globals_for_route)
    exec(compile(ast.Module(body=[route], type_ignores=[]), str(ROUTE_SOURCE), "exec"), namespace)
    return namespace[name]


class PredictionContractTests(unittest.TestCase):
    def route_for(self, model_type, torch_available=True):
        requested_it2 = SyntheticModel()
        combined_calls = []
        combined_result = [{"boxes": [1, 2, 10, 20], "label": "Cardiomegaly", "score": 0.7}]

        def combined_predict(_):
            combined_calls.append(True)
            return combined_result

        route = load_function("predict_image", {
            "request": SyntheticRequest(model_type),
            "logger": QuietLogger(),
            "torch_available": torch_available,
            "jsonify": lambda data: data,
            "get_model": lambda: (requested_it2, SyntheticModel()),
            "model_loading": False,
            "Image": SyntheticImageModule,
            "io": io,
            "transform": lambda _: SyntheticTensor(),
            "torch_no_grad": contextlib.nullcontext,
            "apply_nms": lambda _, iou_threshold: {"boxes": [], "scores": [], "labels": []},
            "predict": combined_predict,
            "draw_predictions_on_image": lambda image, _: image,
            "base64": base64,
            "time": __import__("time"),
        })
        return route, requested_it2, combined_calls

    def test_mock_config_without_torch_returns_pytorch_error_before_image_processing(self):
        route, _, combined_calls = self.route_for("CXR-IT3", torch_available=False)
        response, status = route()
        self.assertEqual(status, 500)
        self.assertIn("PyTorch is not installed", response["error"])
        self.assertEqual(combined_calls, [])

    def test_ui_it2_and_it3_values_both_use_combined_predictions(self):
        for selected in ("CXR-IT2", "CXR-IT3"):
            with self.subTest(selected=selected):
                route, it2, combined_calls = self.route_for(selected)
                response = route()
                self.assertEqual(response["model_used"], selected.lower())
                self.assertEqual(response["predictions"][0]["label"], "Cardiomegaly")
                self.assertEqual(it2.calls, 0)
                self.assertEqual(len(combined_calls), 1)
                self.assertNotIn("simulation_source", response)
                self.assertTrue(response["annotated_image"].startswith("data:image/png;base64,"))

    def test_even_exact_it2_request_is_overwritten_by_combined_predictions(self):
        route, it2, combined_calls = self.route_for("it2")
        response = route()
        self.assertEqual(it2.calls, 1)
        self.assertEqual(len(combined_calls), 1)
        self.assertEqual(response["predictions"][0]["label"], "Cardiomegaly")

    def test_model_status_distinguishes_mock_and_real_model_objects(self):
        for mock in (True, False):
            with self.subTest(mock=mock):
                model = type("SyntheticModel", (), {"is_mock": True})() if mock else object()
                status = load_function("model_status", {
                    "request": SyntheticRequest("combined"),
                    "logger": QuietLogger(),
                    "jsonify": lambda data: data,
                    "os": type("Environment", (), {"environ": {"USE_MOCK_MODELS": str(mock)}}),
                    "get_models": lambda: {},
                    "model_it2": model,
                    "model_it3": model,
                    "model_loading": False,
                    "torch_available": not mock,
                    "classes_it2": range(9),
                    "classes_it3": range(6),
                })()
                expected = "mock" if mock else "real"
                self.assertEqual(status["model_status"]["IT2"]["type"], expected)
                self.assertEqual(status["model_status"]["IT3"]["type"], expected)
                self.assertEqual(status["using_mock_models"], mock)

    def test_model_status_explanation_follows_environment_even_if_object_is_mock(self):
        model = type("SyntheticMock", (), {"is_mock": True})()
        status = load_function("model_status", {
            "request": SyntheticRequest("combined"),
            "logger": QuietLogger(),
            "jsonify": lambda data: data,
            "os": type("Environment", (), {"environ": {"USE_MOCK_MODELS": "false"}}),
            "get_models": lambda: {},
            "model_it2": model,
            "model_it3": model,
            "model_loading": False,
            "torch_available": True,
            "classes_it2": range(9),
            "classes_it3": range(6),
        })()
        self.assertEqual(status["model_status"]["IT2"]["type"], "mock")
        self.assertFalse(status["using_mock_models"])
        self.assertIn("actual trained PyTorch models", status["explanation"])


if __name__ == "__main__":
    unittest.main()
