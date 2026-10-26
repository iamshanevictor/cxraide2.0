# Current product scope

Status: owner-stated scope, 2026-10-27. Implemented behavior is distinguished in `docs/architecture/ARCHITECTURE.md`.

- CXRaide is a **public research showcase** for radiologists and other visitors. It is not for clinical diagnosis or treatment decisions.
- The public demo should let visitors use sample chest X-ray images, generate clearly simulated results, and use the annotation tool without signing in.
- Current implementation gap: the demo's `Load sample` action draws a synthetic CXR-like gradient/noise image in a canvas; it is not yet a sample chest X-ray. A suitable non-identifiable sample and its permission/provenance need owner review.
- Real, separately downloaded models run locally. Hosted inference uses mock models because the large models are unsuitable for the current hosted backend arrangement. Do not present hosted simulations as measured model output.
- A radiologist sign-in and full upload workflow is a future concept, not an approved public account or patient-data service. The current development login does not establish a real radiologist identity.
- Do **not** store identifiable patient images or reports. There is no authoritative Firebase, database, file, or account data to migrate.
- The published metrics and model-training provenance are in a separate repository. Its location and the exact mapping from its results to this UI still need to be recorded.
- Prefer free hosting for this showcase. No public access roles beyond the owner are requested. Any provider plan, usage, region, or account operation remains an owner decision.

## Behavior to preserve during changes

- Public research pages and explicit research-only disclaimers.
- Sample-image demo, manual bounding boxes, simulated prediction display, and useful CSV/PDF/image exports, subject to privacy and report-safety review.
- Local real-model path and IT2/IT3 behavior if validated against the provenance repository and actual weights.

## Exclusions and unresolved scope

- No production patient record system, persistent radiologist accounts, clinical claims, or real-data migration is currently approved.
- Public uploads, browser retention of images, the protected legacy workspace, and report wording need owner review before they are promoted as intended public-demo behavior.

Evidence: [current architecture](docs/architecture/ARCHITECTURE.md), [decision log](docs/architecture/DECISIONS.md), [active tasks](PROJECT_TASKS.md), and current [README](README.md). The README describes the earlier local development setup; this file records the newly clarified product scope.
