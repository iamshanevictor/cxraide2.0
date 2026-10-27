# CX-010: public prediction boundary

Reviewed: 2026-10-27. **Status: approved by owner with “passed, proceed 011”; CX-011 implementation is in progress. No hosting decision.** The owner confirmed the current local demo opens and mock predictions work. This note evaluates the public research showcase only; the separately downloaded real models remain a local Python research path.

## Observed contract

1. `/demo` loads a synthetic illustration into an in-memory `File`. Public file picker and drop controls were removed, but the internal loader remains. [Demo view](../../client/src/views/DemoWorkspaceView.vue); [characterization tests](../../client/tests/demo-contract.test.cjs).
2. `ModelService.predict` resizes that file to a black-padded 512×512 JPEG and posts multipart `image`, `model_type`, and `color_mapping` to `/api/predict`; it includes a browser auth token if one exists. [Client service](../../client/src/services/modelService.js).
3. The Flask route has no authentication decorator. It accepts a directly supplied file, reads and decodes it, and returns predictions plus clean/annotated PNG data URLs. The inspected route has no explicit upload-byte or decoded-pixel limit. [Prediction route](../../server/model_service.py); [Flask registration](../../server/app.py). Thus removing the public picker does not prevent direct API uploads if Flask is publicly hosted.
4. With PyTorch absent, the route returns a PyTorch error before processing the image. The client falls back to random browser findings only for that error text; other failures propagate. The fallback produces one or two findings from four classes, with random locations and scores, independent of image content. [Client fallback](../../client/src/services/modelService.js); [route tests](../../server/tests/test_prediction_contract.py).
5. The response adapter drops `model_used` and other source information. The demo consumes predictions but not the returned image data URLs. UI labels say “AI model,” “Run AI prediction,” and “Inference complete”; the report names the selected model and displays scores without per-result simulation provenance. Existing tests cover these contracts with synthetic data. [Service and demo view](../../client/src/services/modelService.js); [demo tests](../../client/tests/demo-contract.test.cjs).

## Options

| Criterion | A. Browser simulation for `/demo` | B. Host the current Flask mock path | C. Hosted mock with sample IDs only |
|---|---|---|---|
| Required behavior | Can show sample-specific boxes, finding list, and illustrative report without a request. Needs a small, explicit demo result contract. | Current local demo works, but the no-PyTorch path depends on an error-triggered browser fallback; hosting it unchanged does not provide a reliable mock contract. | Can supply centrally managed sample results; requires a new endpoint and explicit sample allowlist. |
| Image transmission | No prediction image request. The browser still downloads the approved sample asset from the static host. | Sends a derived JPEG to the API. A caller can bypass the UI and submit another image. | Sends only a sample identifier if designed correctly; the server validates the identifier and never accepts arbitrary image bytes on the public route. |
| Security and privacy surface | No public image-processing endpoint. Browser code is not an authorization boundary, so it must remain limited to public sample behavior. | Public upload, image decoding, CORS, request sizing, rate limits, logs, and backend retention policy all require review and safeguards. Current route lacks an explicit size/pixel limit and authorization. | Smaller input surface than B, but a public backend still needs abuse controls and operations. |
| Deployment and operating cost | One static frontend to build and host; no mock backend runtime. Provider eligibility, limits, and actual traffic remain unverified. | Separate Python process, runtime monitoring, resource allocation, and public endpoint operations. Exact price cannot be estimated without a provider and traffic data. | Separate backend operations remain, despite reduced image handling. |
| Change and parity risk | Scoped `/demo` change. Must preserve box coordinates, list, annotation, CSV/PDF export, and source labeling. Avoid altering the local real-model path through shared service code. | Less initial frontend wiring, but current mock/PyTorch coupling and misleading labels still need repair; public endpoint hardening is substantial. | New request contract plus server and client changes; useful only if central control provides measured value. |

## Recommendation

**Approved: select A for the public `/demo` route.** Use a small, repeatable scenario for each approved sample (and the interim synthetic illustration). Return class labels and 512×512 box coordinates; the implementation omits confidence scores to avoid implying model confidence. Give results explicit simulated provenance and label the action, findings, and generated report accordingly. The same sample/scenario should produce the same findings on repeat runs; the existing `Math.random()` fallback is unsuitable as the authoritative public demo behavior.

Keep the Python API and real-weight path for local research and separately reviewed future workflows. Implement the public change at the `/demo` boundary so it does not silently replace behavior in the older protected screens. A public static deployment should omit a reachable prediction backend rather than assuming that UI controls protect its upload route. Reconsider option C only if a concrete requirement needs centrally updated scenarios, and measure that value before accepting the additional runtime.

The current IT2/IT3 selector and score percentages could imply that hosted results came from trained weights. Until the checkpoint-to-UI mapping is verified, the public page should call these **demo scenarios** and describe any numbers as illustrative. Do not attach published accuracy metrics to simulated findings. This follows the approved D6 labeling gate in [ADR-002](DECISIONS.md).

## Implementation and release gates

- Characterize the displayed result shape and report wording before the slice. For each sample, verify repeatable 512×512 boxes, label set, simulated provenance, list rendering, annotation overlay, CSV export, and PDF/report wording at their owning boundaries.
- Confirm the public demo makes no prediction POST or model-status request. Check this in a browser preview, not just source tests. Audit other public routes for API dependencies before choosing static-only hosting.
- Preserve the local Python research path and verify no change to its request contract. Do not use browser-supplied identity or ownership for any future protected workflow.
- Keep the synthetic illustration until a specific radiograph passes the separate [sample provenance gate](SAMPLE_PROVENANCE.md).
- Recheck the selected static provider's current eligibility, limits, and preview behavior at the release decision. Account, billing, DNS, and deployment remain owner actions.

## Remaining unknowns and release gates

No deployed backend, traffic measurement, provider account, or actual host logging/retention setting was inspected. The owner-confirmed local run does not establish a hosted result. Sample-image rights and exact research metric/checkpoint mapping remain open.

The owner approved deterministic browser simulation for the public `/demo` while retaining local Python inference. CX-011 implements that direction; browser verification with Flask stopped is still pending. This approval does not select a hosting provider or approve a sample image. The sample rights, site-wide API dependency audit, and deployment gates remain open.
