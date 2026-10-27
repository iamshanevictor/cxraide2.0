# Current product scope

Status: owner-stated scope and D1–D7 approved 2026-10-27. Implemented behavior is distinguished in `docs/architecture/ARCHITECTURE.md`.

- CXRaide is a **public research showcase** for radiologists and other visitors. It is not for clinical diagnosis or treatment decisions.
- The public demo should let visitors use approved sample chest X-ray images, generate clearly simulated results, and use the annotation tool without signing in. Visitor image uploads are outside the approved public-page scope; preserve the existing upload code pending separate review for a local research or future radiologist mode.
- Do not automatically retain demo images in browser storage. Keep explicit export as the way a visitor saves their own annotations.
- Current implementation gap: the demo's `Load sample` action draws a synthetic CXR-like gradient/noise image in a canvas; it is not yet a sample chest X-ray. A suitable non-identifiable sample and its permission/provenance need owner review.
- Real, separately downloaded models run locally. Current hosted inference is intended to use mock models because the large models are unsuitable for the current hosted backend arrangement. Evaluate a clearly labeled browser simulation first; retain a hosted mock API only if its value is demonstrated. Do not present hosted simulations as measured model output.
- A radiologist sign-in and full upload workflow is a future concept, not an approved public account or patient-data service. The current development login does not establish a real radiologist identity.
- Do **not** store identifiable patient images or reports. There is no authoritative Firebase, database, file, or account data to migrate.
- The model-training provenance repository is [CXRaide2.0-Model_Training](https://github.com/iamshanevictor/CXRaide2.0-Model_Training), which contains preparation, export and training notebooks. Use model names only with a tested mapping. The exact mapping of published UI metrics and deployed/local checkpoints to experiment runs remains unverified; do not assert exact metrics until the evidence is linked.
- Prefer free hosting for this showcase. Vercel Hobby is the first static-host candidate, conditional on personal non-commercial eligibility and preview validation. No public access roles beyond the owner are requested. Any provider plan, usage, region, or account operation remains an owner decision.

## Behavior to preserve during changes

- Public research pages and explicit research-only disclaimers.
- Sample-image demo, manual bounding boxes, simulated prediction display, and useful CSV/PDF/image exports, subject to privacy and report-safety review.
- Local real-model path and IT2/IT3 behavior if validated against the provenance repository and actual weights.

## Exclusions and unresolved scope

- No production patient record system, persistent radiologist accounts, clinical claims, or real-data migration is currently approved.
- CX-005 removed visitor upload controls from the public demo, but the API still accepts image uploads if called directly; that server boundary needs a separate hosting decision. CX-004 removed automatic browser image retention for D2. Browser runtime behavior remains to be verified. The protected legacy workspace and report wording still need review before being promoted as intended public-demo behavior.

Evidence: [current architecture](docs/architecture/ARCHITECTURE.md), [decision log](docs/architecture/DECISIONS.md), [active tasks](PROJECT_TASKS.md), and current [README](README.md). The README describes the earlier local development setup; this file records the newly clarified product scope.

The owner approved D1–D7 from the [CX-002 decision package](docs/architecture/CX002_DECISION_PACKAGE.md) on 2026-10-27. [ADR-002 and ADR-003](docs/architecture/DECISIONS.md) record the decisions and remaining evidence gates; approval does not claim that the current application already meets them.
