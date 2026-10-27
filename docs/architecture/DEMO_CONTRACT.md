# Public demo contract: CX-001 discovery

Assessed from source on 2026-10-27 and updated after CX-004/005. **Observed** means a code path exists, not that it passed browser or hosted testing. The owner-stated target is a public, research-only demo with sample chest X-rays, annotation, and clearly simulated results, without storing identifiable patient images or reports.

## Source-backed flow

| Action | Observed input and output | Boundary and evidence |
|---|---|---|
| Open `/demo` | Public route with no sign-in guard. | [Router](../../client/src/router/index.js). |
| Load sample | Creates a 512×512 canvas gradient/noise, converts it to a PNG `File`, then invokes the ordinary loader. It is a synthetic illustration, not a sample chest X-ray. | Browser: [sample loader](../../client/src/views/DemoWorkspaceView.vue). No sample radiograph asset was found in `client/public` or `client/src/assets`. |
| Supply image | CX-005 removed picker/drop controls from the public template. The internal file-loading and old upload handlers remain in code for later review; the sample loader uses the same in-memory path. The public API endpoint still accepts an image when called directly. | Browser: [demo view](../../client/src/views/DemoWorkspaceView.vue), [template/flow tests](../../client/tests/demo-contract.test.cjs); server: [prediction route](../../server/model_service.py). This is a UI restriction, not server-side upload authorization. |
| Retain/clear image | CX-004 removed automatic data-URL/filename saving and restoration. On mount, the demo removes the two legacy `localStorage` keys; loaded files and annotations remain in memory for that visit. Explicit CSV/PDF export remains available. | Browser: [load and legacy cleanup](../../client/src/views/DemoWorkspaceView.vue), [synthetic contract test](../../client/tests/demo-contract.test.cjs). No server image store was found in this path. |
| Draw expert boxes | Pointer drawing, move and delete update in-memory `boxes`. `x`, `y`, `w`, `h` are rendered-viewer pixels with a six-pixel minimum, not normalized or original-image coordinates. | Browser: [box operations](../../client/src/views/DemoWorkspaceView.vue). Responsive reflow parity is untested. |
| Run prediction | Client creates a black-padded 512×512 JPEG and posts it as multipart `image` with `model_type` and `color_mapping` to `/api/predict`; a stored auth token is sent if present. The public Flask route has no token decorator. | [Client service](../../client/src/services/modelService.js), [Flask route](../../server/model_service.py), [API base URL](../../client/src/utils/api.js). This transmits a derived image to the configured API host. |
| Simulate results | Flask can instantiate lightweight mock models. Without PyTorch, the endpoint returns a specific error before model processing; the client catches that text and generates 1–2 random mock findings. Network failures and other errors do not trigger that fallback. | [Server loader/endpoint](../../server/model_service.py), [client fallback](../../client/src/services/modelService.js). The current prediction path is not generally offline-capable. |
| Present predictions | Client maps server `boxes`/`label`/`score` to `box`/`class`/`score`; AI coordinates are treated as 512×512 and scaled to the displayed image. The demo keeps predictions but not the returned clean/annotated image or provenance. | [Response adapter](../../client/src/services/modelService.js), [demo view](../../client/src/views/DemoWorkspaceView.vue). |
| Export expert CSV | Downloads manual boxes only as quoted `image,label,x,y,width,height`. Coordinates are rounded **display pixels**, and the filename is included; AI results are excluded. | Browser: [CSV export](../../client/src/views/DemoWorkspaceView.vue). |
| Generate/export report | Requires a prediction; composes browser HTML with up to six findings scoring at least 0.4, expert-box count, selected model, and research-only disclaimer, then downloads a PDF. No report persistence or image embedding is shown. Date is UTC-derived; time is local. | Browser: [report/PDF](../../client/src/views/DemoWorkspaceView.vue). |

## Simulation and contract findings

- The persistent UI warning and report say the demo is research-only. The prediction action, overlay and success message still use “AI prediction” or “inference” without saying whether this result came from a real server model, server mock, or browser mock. The response adapter drops provenance, so per-result source labeling is not currently reliable. [Demo UI](../../client/src/views/DemoWorkspaceView.vue), [service](../../client/src/services/modelService.js).
- The selector sends `CXR-IT2` and `CXR-IT3`, while Flask checks `model_type == 'it2'` after lowercasing; both selector values enter the combined branch in source. A later unconditional `predictions = predict(image_tensor)` also overwrites the IT2-specific result. CX-003 tests characterize both defects; a repair is separate work. [Selector](../../client/src/views/DemoWorkspaceView.vue), [server mode branch](../../server/model_service.py), [tests](../../server/tests/test_prediction_contract.py).
- Mock configuration does not guarantee a working server mock when PyTorch is absent: the endpoint returns its PyTorch error first, and the browser fallback depends on that exact error text. [Endpoint](../../server/model_service.py), [fallback](../../client/src/services/modelService.js).

## Privacy and verification boundary

**Observed:** CX-004 removed the demo's automatic image and filename storage; CX-005 removed visitor upload controls from the public template. Internal handlers and the unauthenticated prediction endpoint still permit a supplied image if invoked directly. The endpoint reads the upload without an explicit byte or decoded-pixel limit in the inspected route and returns image data URLs; no persistent server write was found in this path. These observations do not establish a particular host's logging, caching, or retention. [Demo view](../../client/src/views/DemoWorkspaceView.vue), [client request](../../client/src/services/modelService.js), [server route](../../server/model_service.py).

**Inference:** The public page now presents only the synthetic sample, but the API remains an image-upload boundary if exposed. A later browser-only simulation could remove the public API dependency after its behavior and disclosure are validated.

**Not verified:** Browser interaction, network traffic, mock or real inference output, CSV/PDF rendering, box responsiveness, deployment or host retention, sample-image rights, and mapping to the separate research repository. CX-003/004 exercised synthetic contract tests only. `client/node_modules` and `server/models` were absent; these tasks did not install packages or use real images.

## Decision inputs for CX-002

1. Visitor upload: approved samples only, or visitor uploads with a non-identifiable-image rule and safeguards?
2. Browser retention: explicit opt-in, or no image retention between visits?
3. Hosted simulation: browser-only simulation, or hosted mock API? Compare result provenance, privacy and free-hosting fit.
4. Sample and model labeling: identify approved chest X-ray samples and rights; decide how IT2/IT3 names should appear for simulations. Record the research repository link and metric mapping.

D1/D2 were approved in CX-002. CX-004 implemented the narrow D2 browser-retention change; CX-005 removed public upload controls while preserving internal upload code for review. A real sample chest X-ray still needs provenance, rights, de-identification and metadata checks. No feature retirement is authorized by this discovery note.
