# Session handoff

Updated: 2026-10-27. This is a concise working note, not an authorization to deploy.

## Current state

- CX-001 discovery is complete locally in documentation. At the start of this task, `main` was one commit ahead of `origin/main`, with pre-existing changes in `PROJECT_TASKS.md` and `SESSION.md`. No application code, schemas, dependencies, configuration, or deployment were changed by CX-001.
- Owner clarified: public research demo; local real weights; hosted simulated output; no authoritative legacy data; no identifiable patient image/report storage; free hosting preferred; radiologist login is a future concept. The separate [model-training repository](https://github.com/iamshanevictor/CXRaide2.0-Model_Training) is verified; exact UI metric-to-run mapping remains unverified.
- Current code is Vue/Vite plus Flask; no active database or durable jobs. Existing development login and browser offline token are not production identity. See `docs/architecture/ARCHITECTURE.md`.
- Python source syntax parse passed for the two server files. CX-003 added dependency-free Node/Python contract tests, passing 5/5 each. CX-004/005 updated the client tests; all seven pass. Client packages, Python application libraries and model weights are absent, so lint/build, Flask/Pillow/Torch integration, real inference and deployed behavior remain unverified.
- [Demo contract](docs/architecture/DEMO_CONTRACT.md) records sample, upload, annotation, export, prediction, and retention paths with CX-004/005 updates. The public page now offers only a clearly labeled synthetic illustration; CX-004 stopped automatic image storage/restore and clears legacy keys. Internal upload code and the public prediction API can still accept images if called directly. Predictions send a resized JPEG to the API and are not generally offline-capable. Browser runtime behavior remains unverified.
- CX-006 reviewed NIH ChestX-ray14, CheXpert, PadChest, and MIMIC-CXR source terms. [Sample provenance](docs/architecture/SAMPLE_PROVENANCE.md) records that no candidate is cleared: NIH terms were not verifiable from the official portal, CheXpert redistribution is unknown, PadChest requires written permission, and MIMIC-CXR terms prohibit sharing. No file was provided or inspected, and no asset was added.
- [CX-003 tests](client/tests/demo-contract.test.cjs) and [server route tests](server/tests/test_prediction_contract.py) characterize these paths with synthetic files and stubs. They confirm both UI modes use combined prediction, exact `it2` is overwritten, only the named PyTorch error triggers client fallback, and response provenance is dropped. Model status labels mock/real objects but can claim real in its explanation when the environment flag and object disagree. Synthetic CSV and report HTML were asserted; actual PDF rendering was not verified.

## Decisions and gates

- ADR-001 records owner-stated scope. The owner approved D1–D7 on 2026-10-27; [ADR-002/003](docs/architecture/DECISIONS.md) and [CX-002's decision package](docs/architecture/CX002_DECISION_PACKAGE.md) record the accepted public-demo, hosting-evaluation and incremental-change direction. CX-004 implements D2 at the source/test boundary, and CX-005 implements D1 at the public UI boundary. An actual approved chest X-ray sample and the eventual API exposure decision remain open.
- Still unverified: actual sample-image rights/de-identification/metadata, exact UI metric-to-run and checkpoint mapping, Vercel Hobby account eligibility, and deployment preview. D6 gates exact metric publication; D4 makes Vercel a conditional first candidate, not a deployed provider.
- Account, billing, DNS, production deployment, real-data and destructive actions remain owner-operated gates.

## Next action

`CX-005` and `CX-006` are `DONE locally`. CX-006's candidate research is complete, but no image is cleared for publication; the owner must verify redistribution rights, select a specific file, and approve its privacy review before an asset is added. There is no `READY` task. Do not perform cloud/account actions.

Owner model preference (2026-10-27): GPT-6 Luna · Low for most coding, tests and edits; Luna · Medium only when a bounded task needs it. GPT-6 Sol · Low for architecture/security/data review and Sol · Medium for consequential conflicting evidence. Avoid Sol · High and Astra as routine routes. For future sample-file review, use Luna · Low for metadata/source extraction and Sol · Low for privacy/rights analysis; use Sol · Medium only for conflicting evidence. Record intended route and actual model/effort when the runtime exposes them.

`CX-007` recorded this routing update. CX-006 documentation title: `docs(demo): vet sample provenance`. Proposed CX-007 title: `docs(ai): prefer Luna for scoped work`. No commits were created automatically by these turns.

Task reports include a concise Conventional Commit title with an optional short scope. Task IDs stay in the queue. The recorded CX-005 title is `fix(demo): restrict public image input to samples`. No commit was created automatically by this turn.
