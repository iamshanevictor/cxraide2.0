# Session handoff

Updated: 2026-10-27. This is a concise working note, not an authorization to deploy.

## Current state

- CX-001 discovery is complete locally in documentation. At the start of this task, `main` was one commit ahead of `origin/main`, with pre-existing changes in `PROJECT_TASKS.md` and `SESSION.md`. No application code, schemas, dependencies, configuration, or deployment were changed by CX-001.
- Owner clarified: public research demo; local real weights; hosted simulated output; no authoritative legacy data; no identifiable patient image/report storage; free hosting preferred; radiologist login is a future concept. The separate [model-training repository](https://github.com/iamshanevictor/CXRaide2.0-Model_Training) is verified; exact UI metric-to-run mapping remains unverified.
- Current code is Vue/Vite plus Flask; no active database or durable jobs. Existing development login and browser offline token are not production identity. See `docs/architecture/ARCHITECTURE.md`.
- Python source syntax parse passed for the two server files. CX-003 added dependency-free Node/Python contract tests, passing 5/5 and 5/5 respectively. CX-004 updated the client retention test, and all five client tests pass. Client packages, Python application libraries and model weights are absent, so lint/build, Flask/Pillow/Torch integration, real inference and deployed behavior remain unverified.
- [Demo contract](docs/architecture/DEMO_CONTRACT.md) records sample, upload, annotation, export, prediction, and retention paths with code evidence and the CX-004 update. The sample remains synthetic and visitor upload is still exposed; CX-004 stopped automatic browser image storage/restore and clears legacy keys on mount. Predictions still send a resized JPEG to the API and are not generally offline-capable. Browser runtime behavior remains unverified.
- [CX-003 tests](client/tests/demo-contract.test.cjs) and [server route tests](server/tests/test_prediction_contract.py) characterize these paths with synthetic files and stubs. They confirm both UI modes use combined prediction, exact `it2` is overwritten, only the named PyTorch error triggers client fallback, and response provenance is dropped. Model status labels mock/real objects but can claim real in its explanation when the environment flag and object disagree. Synthetic CSV and report HTML were asserted; actual PDF rendering was not verified.

## Decisions and gates

- ADR-001 records owner-stated scope. The owner approved D1–D7 on 2026-10-27; [ADR-002/003](docs/architecture/DECISIONS.md) and [CX-002's decision package](docs/architecture/CX002_DECISION_PACKAGE.md) record the accepted public-demo, hosting-evaluation and incremental-change direction. CX-004 implements D2 at the source/test boundary; D1 remains incomplete while visitor upload is exposed.
- Still unverified: actual sample-image rights/de-identification/metadata, exact UI metric-to-run and checkpoint mapping, Vercel Hobby account eligibility, and deployment preview. D6 gates exact metric publication; D4 makes Vercel a conditional first candidate, not a deployed provider.
- Account, billing, DNS, production deployment, real-data and destructive actions remain owner-operated gates.

## Next action

`CX-004` is `DONE locally`: no automatic image/filename storage or restore, legacy key cleanup on mount, 5/5 focused client tests passing. `CX-005` is the sole `READY` task: remove visitor upload controls from the public demo while preserving sample annotation/export and keeping upload-capable code for later review. The interim sample is still synthetic; a real sample needs provenance and rights review. Do not perform cloud/account actions.

Task reports include a proposed Conventional Commit title and `Refs:` footer; scopes name codebase areas, as requested. CX-004: `fix(demo): stop automatic image retention` with `Refs: CX-004`. No commit was created automatically.
