# Session handoff

Updated: 2026-10-27. This is a concise working note, not an authorization to deploy.

## Current state

- CX-001 discovery is complete locally in documentation. At the start of this task, `main` was one commit ahead of `origin/main`, with pre-existing changes in `PROJECT_TASKS.md` and `SESSION.md`. No application code, schemas, dependencies, configuration, or deployment were changed by CX-001.
- Owner clarified: public research demo; local real weights; hosted simulated output; no authoritative legacy data; no identifiable patient image/report storage; free hosting preferred; radiologist login is a future concept. The separate [model-training repository](https://github.com/iamshanevictor/CXRaide2.0-Model_Training) is verified; exact UI metric-to-run mapping remains unverified.
- Current code is Vue/Vite plus Flask; no active database or durable jobs. Existing development login and browser offline token are not production identity. See `docs/architecture/ARCHITECTURE.md`.
- Python source syntax parsing passed for the two server files. CX-003 added dependency-free Node/Python contract tests, passing 5/5 each. CX-004/005 client tests passed 7/7; CX-011's updated demo contract tests pass 8/8 and targeted ESLint passes. The local virtual environment and client packages are present; PyTorch and model weights remain unavailable. Real inference and deployed behavior remain unverified.
- [Demo contract](docs/architecture/DEMO_CONTRACT.md) records sample, annotation, export, prediction, and retention paths. The public page now bundles the owner-provided chest X-ray sample and fixed browser-simulated findings; prediction does not send the image to Flask. CX-004 stopped automatic image storage/restore and clears legacy keys. The separate public API endpoint still accepts images if directly called or exposed. Manual browser/network checks are deferred to the end-stage validation pass.
- CX-006 reviewed NIH ChestX-ray14, CheXpert, PadChest, and MIMIC-CXR sources. CX-012/013 reviewed and integrated the owner-selected sample, linked the two owner-identified project datasets, and recorded source terms and image-level limitations in [sample provenance](docs/architecture/SAMPLE_PROVENANCE.md). The owner states the sample contains no PII; its original dataset ID is not preserved in the flattened rendering.
- [CX-003 tests](client/tests/demo-contract.test.cjs) and [server route tests](server/tests/test_prediction_contract.py) characterize these paths with synthetic files and stubs. They confirm both UI modes use combined prediction, exact `it2` is overwritten, only the named PyTorch error triggers client fallback, and response provenance is dropped. Model status labels mock/real objects but can claim real in its explanation when the environment flag and object disagree. Synthetic CSV and report HTML were asserted; actual PDF rendering was not verified.

## Decisions and gates

- ADR-001 records owner-stated scope. The owner approved D1–D7 on 2026-10-27; [ADR-002/003/004](docs/architecture/DECISIONS.md) and [CX-002's decision package](docs/architecture/CX002_DECISION_PACKAGE.md) record the accepted public-demo, hosting-evaluation, incremental-change, and browser-simulation direction. CX-004 implements D2; CX-005 implements D1; CX-011 implements the public `/demo` simulation. A sample image and public backend exposure remain open.
- Still unverified: actual sample-image rights/de-identification/metadata, exact UI metric-to-run and checkpoint mapping, Vercel Hobby account eligibility, and deployment preview. D6 gates exact metric publication; D4 makes Vercel a conditional first candidate, not a deployed provider.
- Account, billing, DNS, production deployment, real-data and destructive actions remain owner-operated gates.

## Next action

CX-015 is owner-approved and complete. Its five-route production build passed focused tests, lint, and build; the generated assets contain no local Flask URL or legacy page chunks. Manual browser checks remain deferred. CX-016's [Vercel preview plan](docs/architecture/CX016_VERCEL_PREVIEW_PLAN.md) is complete locally and waiting for owner review. Official Vercel documents were checked on 2026-10-27 for Hobby eligibility/limits, Vite SPA rewrites, `client` monorepo root and `dist` output, protected previews, and rollback. No account, project, configuration, deployment, or DNS change was made. The owner must confirm Hobby eligibility and host direction before any account operation. Next prepared: CX-017 metric provenance audit, with `passed, proceed 017` as the recorded shortcut. CX-016 title: `docs: prepare static preview release plan`.

Owner model preference (2026-10-27): GPT-6 Luna · Low for most coding, tests and edits; Luna · Medium only when a bounded task needs it. GPT-6 Sol · Low for architecture/security/data review and Sol · Medium for consequential conflicting evidence. Avoid Sol · High and Astra as routine routes. For future sample-file review, use Luna · Low for metadata/source extraction and Sol · Low for privacy/rights analysis; use Sol · Medium only for conflicting evidence. Record intended route and actual model/effort when the runtime exposes them.

`CX-007` recorded model routing. The owner prefers one-line, unscoped Conventional Commit titles with no second message or footer. CX-009 title: `docs: verify local startup`; CX-010 title: `docs: decide public prediction boundary`; CX-011 title: `feat: simulate demo predictions in browser`; CX-012 title: `docs: review demo image provenance`; CX-013 title: `feat: add approved demo image`. No commit was created automatically.

Task reports include a concise, single-line Conventional Commit title without a scope or footer. Task IDs stay in the queue.
