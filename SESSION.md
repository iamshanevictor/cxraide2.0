# Session handoff

Updated: 2026-10-27. This is a concise working note, not an authorization to deploy.

## Current state

- CX-001 discovery is complete locally in documentation. At the start of this task, `main` was one commit ahead of `origin/main`, with pre-existing changes in `PROJECT_TASKS.md` and `SESSION.md`. No application code, schemas, dependencies, configuration, or deployment were changed by CX-001.
- Owner clarified: public research demo; local real weights; hosted simulated output; no authoritative legacy data; no identifiable patient image/report storage; free hosting preferred; radiologist login is a future concept. The separate [model-training repository](https://github.com/iamshanevictor/CXRaide2.0-Model_Training) is verified; exact UI metric-to-run mapping remains unverified.
- Current code is Vue/Vite plus Flask; no active database or durable jobs. Existing development login and browser offline token are not production identity. See `docs/architecture/ARCHITECTURE.md`.
- Python source syntax parse passed for the two server files. CX-003 added dependency-free Node/Python contract tests, passing 5/5 and 5/5 respectively. Client packages, Python application libraries and model weights are absent, so lint/build, Flask/Pillow/Torch integration, real inference and deployed behavior remain unverified.
- [CX-001 demo contract](docs/architecture/DEMO_CONTRACT.md) records sample, upload, annotation, export, prediction, and retention paths with code evidence. The sample is synthetic; visitor uploads auto-save the original file in browser storage; predictions send a resized JPEG to the API and are not generally offline-capable. Runtime behavior remains unverified.
- [CX-003 tests](client/tests/demo-contract.test.cjs) and [server route tests](server/tests/test_prediction_contract.py) characterize these paths with synthetic files and stubs. They confirm both UI modes use combined prediction, exact `it2` is overwritten, only the named PyTorch error triggers client fallback, and response provenance is dropped. Model status labels mock/real objects but can claim real in its explanation when the environment flag and object disagree. Synthetic CSV and report HTML were asserted; actual PDF rendering was not verified.

## Decisions and gates

- ADR-001 records owner-stated scope. The owner approved D1–D7 on 2026-10-27; [ADR-002/003](docs/architecture/DECISIONS.md) and [CX-002's decision package](docs/architecture/CX002_DECISION_PACKAGE.md) record the accepted public-demo, hosting-evaluation and incremental-change direction. Current code has not yet been changed to meet D1/D2.
- Still unverified: actual sample-image rights/de-identification/metadata, exact UI metric-to-run and checkpoint mapping, Vercel Hobby account eligibility, and deployment preview. D6 gates exact metric publication; D4 makes Vercel a conditional first candidate, not a deployed provider.
- Account, billing, DNS, production deployment, real-data and destructive actions remain owner-operated gates.

## Next action

`CX-003` is `DONE locally` with 10 focused tests passing. `CX-004` is the sole `READY` task: remove automatic public-demo image/filename retention and restore, including cleanup of legacy storage keys. Begin with the view and existing contract tests; preserve explicit export. Do not infer a broader backlog or perform cloud/account actions.

Task reports now include the exact proposed commit message recorded in `PROJECT_TASKS.md`; no commit is created automatically. CX-003: `test(cx-003): characterize public demo and inference contract`.
