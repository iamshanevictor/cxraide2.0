# Project Development Queue

Last updated: 2026-10-27

## Project Goal

Maintain CXRaide as a public, research-only chest X-ray annotation showcase. Visitors should be able to try a sample image, draw annotations, and see clearly simulated results. Separately downloaded real models remain available for local research use. The public demo must not store identifiable patient images or reports. Radiologist accounts and persistent records are future concepts, not current implementation requirements. See [requirements](REQUIREMENTS.md) and the [architecture map](docs/architecture/ARCHITECTURE.md).

## Current State

- CX-001 discovery, CX-003 characterization, CX-004 image-retention change, and CX-005 public-input change are complete locally. The Flask application was not changed.
- There is no active database, durable job system, or authoritative legacy data. Focused dependency-free contract tests now cover the demo and route boundaries.
- CX-013 replaced the synthetic placeholder with the owner-provided 474×474 chest X-ray sample bundled in `client/src/assets/cxraide-demo-sample.png`. The public view links the NIH Bbox and VinBigData datasets identified by the owner as training/validation sources, shows an on-image research/simulated/not-for-diagnosis watermark, and keeps simulated findings independent of image content. The exact sample-to-dataset ID is not preserved in the flattened attachment. CX-005 removed public picker/drop controls; the unauthenticated API still accepts direct image uploads if exposed. CX-004 stopped automatic browser image retention and clears the two legacy keys on mount.
- Hosted results are intended to be simulated. Real inference works locally with separately downloaded weights, according to the owner; weights and runtime inference were not available for this assessment.
- The owner approved CX-002's D1–D7 directions on 2026-10-27. ADR-002/003 record them; D1 and D2 are implemented at the public UI/source boundaries. The sample is now provided and linked, with exact source-record match documented as unknown. Public API exposure, metric-to-run mapping, and host eligibility remain gates.
- CX-003's synthetic contract tests captured the former browser image retention, display-pixel CSV, PyTorch-text-only client fallback, and IT2/IT3 mode-selection defects. No real weights or installed application dependencies were available.

## Where the project is heading

**Destination:** a public, static research showcase with the approved sample, manual annotation, clearly simulated results, defensible research claims, and no hosted patient upload or account/data store. Local Python inference remains a separate researcher workflow. Radiologist accounts and persistence need a later product decision; they are not on the current release path.

| Horizon | Outcome and grouped work | Gate / evidence | Suggested grouped commit |
|---|---|---|---|
| **Now — CX-018/019: local release candidate** | Research claims and the public demo were corrected and checked together. | [Local validation evidence](docs/architecture/CX019_CX020_RELEASE_READINESS.md); owner reviews the candidate. | `fix: align public research demo` |
| **Next — CX-020: protected preview and release** | Owner operates a protected Vercel preview using the CX-016 plan, reviews release evidence, then decides whether to make production public. | Hobby eligibility, metric/sample publication gates, preview parity, owner approval for account/DNS/deployment and rollback readiness. | `docs: prepare public release` if repository changes are needed |
| **Later option — no active ID** | Revisit radiologist sign-in, uploaded X-rays, storage and real hosted inference only if a new requirement and operating model are approved. | Separate architecture/privacy/authorization decision. | None |

These are planning horizons, not a promise to deploy or an invented code backlog. Keep the active milestone detailed; refine later horizons only when their gate is reached. Aim for one commit per validated milestone, not one commit per queue update. Completed CX-001–019 history is retained below.

## Active Queue

CX-017 through CX-019 are complete locally following the owner's `proceed 017-020` direction. CX-020 is waiting on owner-operated host/account and publication gates. No local Vercel project link or deployment evidence was found; remote account state was not verified. The local release candidate and remaining preview checks are in the linked readiness note.

| ID | Status | Milestone | Evidence / gate |
|---|---|---|---|
| CX-017 | DONE | Metric provenance audit complete | Conservative treatment accepted by `proceed 017-020` |
| CX-018 | DONE locally | Align public Metrics and Research claims | Source-backed copy, targeted lint/tests/build and browser rendering passed |
| CX-019 | DONE locally | End-stage validation and fixes | Five routes, sample, simulated results, annotation, CSV/PDF, narrow layout; limits in readiness note |
| CX-020 | WAITING_ON_OWNER | Owner-operated protected preview and public release | Eligibility, sample publication, protected preview and explicit deployment gates |

## How to Use This File

1. Read `AGENTS.md`, `SESSION.md`, Git status, and the selected `READY` task if one exists; then inspect only directly relevant sources/tests.
2. Follow the task's bounded scope and route; default to GPT-6 Luna · Low for edits/coding and use GPT-6 Sol · Low or Medium for consequential architecture/security/data judgment. Check model availability when beginning a task.
3. Record observations separately from inferences. Complete task-specific validation and note checks that could not run.
4. Record local completion evidence and update `SESSION.md`. Promote a dependent task only when each prerequisite's required evidence exists. Keep hosted and owner acceptance separate.
5. Update an ADR for a consequential decision. Archive lengthy completed details if the live queue becomes hard to scan. Do not invent tasks when the queue is exhausted.
6. Give active tasks a suggested, single-line Conventional Commit title in `type: description` form. Omit scopes, second message lines, and footers. Several related tasks may share one actual milestone commit after validation; do not commit automatically or at every handoff. Historical titles remain as recorded.
7. Keep the current task and two or three outcome-level horizons visible at the top. When a task enters `WAITING_ON_OWNER`, prepare its successor as `PLANNED` with the owner decision as an explicit dependency; later horizons stay `PROPOSED` until scoped against relevant code. If the owner says `passed, proceed 0XX`, treat that as approval of the recorded gate and authorization to start the named task, unless its scope materially differs.

## Status Legend

- `PROPOSED` — possible work whose scope or approval is not settled.
- `PLANNED` — accepted sequence, waiting for a named dependency.
- `READY` — next eligible task with dependencies satisfied; at most one at a time. An owner-decision gate can leave zero ready tasks.
- `IN_PROGRESS` — actively being worked.
- `BLOCKED` — cannot progress until a specific condition changes.
- `WAITING_ON_OWNER` — local work is complete and a concrete owner review or operation is next.
- `DONE` — required local validation evidence is recorded; hosted or owner acceptance is stated separately.
- `CANCELLED` — withdrawn with a reason and never promoted automatically.

## Detailed Tasks

## CX-001 — Verify the public demo contract and privacy boundary

- **Objective and bounded scope:** Map the public sample-image, simulated prediction, manual annotation, export, public-upload, and browser-retention paths. Trace inputs/outputs in `DemoWorkspaceView.vue`, `modelService.js`, and relevant Flask routes. Record what runs without a backend and what currently depends on it. This is read-only discovery.
- **Priority / status:** P0 / **DONE locally**. **Executor:** Codex.
- **Dependencies:** None.
- **Inspect first:** `REQUIREMENTS.md`; `client/src/views/DemoWorkspaceView.vue`; `client/src/services/modelService.js`; `client/src/router/index.js`; `server/model_service.py` route signatures.
- **Implementation boundaries:** Documentation and evidence only. No application edits, dependency installation, production account work, or real data.
- **Acceptance criteria:** A short contract table covers sample origin, each simulation path, manual-box coordinate meaning, CSV/PDF outputs, upload handling, browser persistence, and research-only labels. Distinguish observed facts from assumptions. Identify any current path that could retain or send an identifiable image.
- **Required tests and manual validation:** Source review and targeted static checks; no app test suite required. If a safe local run is already available without installing anything, record observations separately; it is not required for completion.
- **Expected deliverables:** Contract evidence added to `docs/architecture/ARCHITECTURE.md` or a linked concise note; updated `SESSION.md`; proposed follow-up only for verified gaps.
- **Recommended model and effort for a rerun:** GPT-6 Luna · Low for bounded extraction; GPT-6 Sol · Low for privacy judgment, Medium only if evidence conflicts.
- **Implementation prompt:** Map only the current public demo's sample, prediction, annotation, export, upload, and retention paths. Produce source-backed contract evidence, update the architecture note and session handoff, and record unverified behavior. Do not implement or install anything.
- **Commit title:** `docs(arch): map demo contract`.
- **Completion evidence (2026-10-27):** [Demo contract](docs/architecture/DEMO_CONTRACT.md) covers required paths with source links, observed/inferred/unknown labels, and decision inputs. Targeted source reads completed. Document links, whitespace, and `git diff --check` passed. Browser/API runtime, PDF/CSV output, and hosted behavior were not exercised because dependencies and model weights were absent. No application code, install, deployment, or commit was performed for CX-001. Owner acceptance is separate.

## CX-002 — Confirm product and hosting decisions

- **Objective and bounded scope:** Review ADR-002/003 and decide public-upload policy, whether the hosted demo needs any Flask API, sample-image provenance, and the scope of radiologist sign-in. Record the separate research repository URL and the metric-to-UI mapping.
- **Priority / status:** P0 / **DONE**; D1–D7 approved and recorded. **Executor:** Owner decides; Codex records choices.
- **Dependencies:** CX-001 evidence, so the owner can review concrete paths.
- **Inspect first:** `REQUIREMENTS.md`; `docs/architecture/DECISIONS.md`; CX-001 contract; `README.md` deployment section.
- **Implementation boundaries:** Decision and documentation only. No cloud setup, billing, DNS, deployment, or application change.
- **Acceptance criteria:** Owner explicitly accepts or revises each scope decision; ADR statuses and `REQUIREMENTS.md` reflect the answer; provider eligibility and actual free-plan fit are rechecked at selection.
- **Required tests and manual validation:** Consistency review across requirements, ADRs and architecture; no application tests.
- **Expected deliverables:** Dated ADR update, revised scope, hosting choice or a clearly stated remaining decision.
- **Recommended model and effort for a rerun:** GPT-6 Sol · Medium for the multi-decision architecture review; Luna · Low for mechanical documentation edits.
- **Implementation prompt:** After CX-001, present the verified public-demo choices and hosting tradeoffs to the owner. Record explicit answers in the ADRs and requirements. Do not treat a proposal or silence as approval.
- **Commit title:** `docs(arch): record demo hosting decisions`.
- **Completion evidence (2026-10-27):** CX-001 prerequisite met. The [CX-002 decision package](docs/architecture/CX002_DECISION_PACKAGE.md) covers D1–D7 with options, tradeoffs, source evidence, and verified provider terms. The owner explicitly approved D1–D7; [ADR-002/003](docs/architecture/DECISIONS.md) and `REQUIREMENTS.md` record the accepted direction. The separate training repository URL is recorded; exact UI metric-to-run mapping remains unverified and gates metric publication. Sample rights, host eligibility and preview are later gates. Documentation consistency and `git diff --check` passed. No application, cloud or account action was performed.

## CX-003 — Characterize existing demo and inference behavior

- **Objective and bounded scope:** Add focused tests for approved public-demo behavior and the existing mock/real inference contract, including mode selection and failure labeling. Use synthetic images and no model weights in Git.
- **Priority / status:** P1 / **DONE locally**. **Executor:** Codex.
- **Dependencies:** CX-001 and CX-002 completed with recorded evidence.
- **Inspect first:** Approved demo contract; `client/src/views/DemoWorkspaceView.vue`; `client/src/services/modelService.js`; `server/app.py`; `server/model_service.py`; test/tool manifests.
- **Implementation boundaries:** Tests and only minimal testability seams; no feature rewrite, new persistence, account provider, or deployment. Local model validation requires owner-supplied trusted weights outside Git.
- **Acceptance criteria:** Tests distinguish simulated and real paths, preserve useful manual-box/export behavior, and demonstrate any verified mode-selection or mock fallback defects without asserting clinical accuracy.
- **Required tests and manual validation:** Run only the added focused tests and existing relevant lint/build when dependencies are available; review representative synthetic CSV/PDF output and record unrun gates.
- **Expected deliverables:** Focused characterization tests, test commands/results, and updated `SESSION.md`.
- **Recommended model and effort for a rerun:** GPT-6 Luna · Low for scoped tests; GPT-6 Sol · Low for cross-layer interpretation, Medium only if the evidence conflicts.
- **Implementation prompt:** Once CX-001 is validated and CX-002 decisions are approved, write focused characterization tests for the approved demo and current mock/real API behavior with synthetic fixtures. Report exact test evidence and limits before proposing repairs.
- **Recorded commit title:** `test(cx-003): characterize public demo and inference contract` (created before the code-area scope preference).
- **Completion evidence (2026-10-27):** Added [client contract tests](client/tests/demo-contract.test.cjs) and [server route contract tests](server/tests/test_prediction_contract.py), using synthetic data and only Node/Python standard libraries. `node --test client/tests/demo-contract.test.cjs` passed 5/5; `python -m unittest discover -s server/tests -p 'test_*.py' -v` passed 5/5. Client tests captured current automatic image retention, display-pixel manual boxes and quoted CSV (excluding AI boxes), research-only HTML and PDF-export invocation, selected model field, dropped response provenance, exact-PyTorch-error fallback, and network-error propagation. Server tests captured no-Torch rejection, both UI model values entering the combined branch, exact `it2` predictions being overwritten by a combined result, mock/real object status labeling, and an inconsistent explanation when a mock object exists but the environment flag says real. A representative synthetic CSV string and report HTML were asserted; the PDF library was stubbed, so PDF bytes/rendering were not verified. Flask/Pillow/Torch integration, real weights, browser UI, hosted behavior, `npm` build/lint, and real PDF output remain unverified because application dependencies and model files are absent. `git diff --check` passed; no app implementation, dependency, config, cloud, or account change was made.

## CX-004 — Stop automatic public-demo image retention

- **Objective and bounded scope:** Align the public demo with approved D2 by removing automatic `localStorage` save/restore of image bytes and filename while preserving in-session annotation and explicit export.
- **Priority / status:** P1 / **DONE locally**. **Executor:** Codex.
- **Dependencies:** CX-003 contract evidence, including the current retention test, completed.
- **Inspect first:** `client/src/views/DemoWorkspaceView.vue`, `client/tests/demo-contract.test.cjs`, ADR-002 and `REQUIREMENTS.md`.
- **Implementation boundary:** Public demo browser behavior only. No sample-asset selection, upload-path retirement, API rewrite, database, accounts, or deployment.
- **Acceptance criteria:** Loading an image does not write its bytes or filename to browser storage; reopening the demo does not restore a prior image; explicit CSV/PDF export and in-session boxes still work. Clean up legacy `cxraide_last_image` keys during this change so existing local copies are not restored later.
- **Validation:** Update and run focused Node contract tests with synthetic files; run existing client lint/build only if dependencies are present; record browser verification limits.
- **Deliverables:** Small view change, revised contract tests, `SESSION.md` evidence.
- **Recorded commit title:** `fix(demo): stop automatic image retention`.
- **Completion evidence (2026-10-27):** `DemoWorkspaceView.vue` no longer reads files into data URLs for storage or restores a prior image. On mount, it removes `cxraide_last_image` and `cxraide_last_image_name` in a guarded cleanup. The public hint now says images are not saved between visits. Updated synthetic contract test checks legacy cleanup, zero storage writes, an in-memory loaded file, and a fresh view with no restored image. Existing drawing/CSV and report/PDF-invocation contract tests still pass. `node --test client/tests/demo-contract.test.cjs` passed 5/5. Browser interaction, actual PDF rendering, and client lint/build remain unverified because `client/node_modules` is absent. No dependency, account, cloud or deployment action was performed.

## CX-005 — Restrict public demo UI to sample input

- **Objective and bounded scope:** Align `/demo` with approved D1 by removing visitor file selection and drop controls from the public view while preserving the internal file-loading path for the sample and possible later reviewed modes.
- **Priority / status:** P1 / **DONE locally**. **Executor:** Codex.
- **Dependencies:** CX-001 upload-path evidence, CX-003 tests, and owner approval of D1 are recorded. CX-004 is complete.
- **Inspect first:** `client/src/views/DemoWorkspaceView.vue`, `client/tests/demo-contract.test.cjs`, ADR-002 and `REQUIREMENTS.md`.
- **Implementation boundary:** Public demo UI only. Preserve upload-capable code for later local research/radiologist review; do not add an unapproved chest X-ray asset, rewrite inference, or deploy.
- **Acceptance criteria:** Public demo exposes no picker/drop upload action; its existing synthetic sample still supports annotation, prediction request, CSV and report generation. The page clearly calls that interim image synthetic until a sourced radiograph is approved.
- **Validation:** Update and run focused synthetic client tests; run lint/build if dependencies become available; record browser limits and the remaining sample-provenance gate.
- **Deliverables:** Small UI/test change and `SESSION.md` evidence.
- **Recorded commit title:** `fix(demo): restrict public image input to samples`.
- **Completion evidence (2026-10-27):** Removed public file picker, drop area, and upload invitation from `DemoWorkspaceView.vue`. The public action and empty state explicitly say the current image is synthetic. Internal loader/old upload handlers remain for later reviewed modes. Updated tests assert the template has no file input or drop handler and exercise synthetic sample loading through annotation, prediction request, and report generation. Existing CSV/PDF-invocation and retention tests still pass. `node --test client/tests/demo-contract.test.cjs` passed 7/7; `git diff --check` passed. The endpoint still accepts direct uploads if exposed, so this is a UI restriction only. Browser interaction, client lint/build, actual PDF and hosted behavior were not verified because `client/node_modules` is absent. No dependencies, cloud, accounts, or deployment changed.

## CX-006 — Vet a chest X-ray sample candidate

- **Objective and bounded scope:** Find one or two candidate public chest X-ray images to replace the synthetic illustration after evidence review. Document source, rights for redistribution in a public demo, de-identification basis, embedded metadata handling, and suitability for annotation.
- **Priority / status:** P1 / **DONE locally**. **Executor:** Codex prepares evidence; owner approves any selected asset.
- **Model and effort:** GPT-6 Luna · Low for candidate/source extraction; GPT-6 Sol · Low for rights and privacy review. Use Sol · Medium only if evidence conflicts and record why.
- **Dependencies:** D1 approved and CX-005 public UI restriction complete.
- **Inspect first:** `REQUIREMENTS.md`, ADR-002, `docs/architecture/DEMO_CONTRACT.md`, and the current sample loader. Consult primary dataset/license sources rather than copying an image from a search result.
- **Implementation boundary:** Research and decision package only. No asset addition, data upload, production deployment, or clinical claim until rights and privacy evidence are reviewed.
- **Acceptance criteria:** Candidate table with direct source/license links, allowed use and attribution terms, known de-identification and metadata facts, and an explicit unknown/owner gate. Identify whether the candidate is suitable as a public downloadable asset; do not infer permission from accessibility.
- **Validation:** Verify current source/license pages and inspect any provided candidate file metadata with deterministic tools if available; record unavailable checks. Owner selection is separate from local research completion.
- **Deliverables:** [Sample-provenance note](docs/architecture/SAMPLE_PROVENANCE.md), updated task status and `SESSION.md`.
- **Commit title:** `docs(demo): vet sample provenance`.
- **Completion evidence (2026-10-27):** Reviewed the primary Stanford CheXpert page and PadChest research-use agreement, NIH's original download portal and dataset paper, and PhysioNet's MIMIC-CXR terms. The [sample-provenance note](docs/architecture/SAMPLE_PROVENANCE.md) records candidate terms, privacy facts, unknowns, and owner gates. NIH remains conditional because the official portal terms could not be verified; CheXpert redistribution terms remain unknown; PadChest requires prior written permission; MIMIC-CXR terms prohibit sharing. No image was supplied or downloaded, so file-level metadata, overlays, and pixel inspection remain unverified. No asset was added. Local research is complete; owner review is required before selecting or adding an image. Commit title: `docs(demo): vet sample provenance`.

## CX-007 — Update model and effort routing

- **Objective and bounded scope:** Make GPT-6 Luna the default for most coding and edits, reserve GPT-6 Sol for architecture/security/data judgment, and specify Low/Medium effort criteria.
- **Priority / status:** P2 / **DONE locally**. **Executor:** Codex.
- **Dependencies:** Owner's explicit routing preference.
- **Inspect first:** `AGENTS.md`, `AI_DEVELOPMENT_WORKFLOW.md`, `PROJECT_TASKS.md`, `SESSION.md`, and current model availability.
- **Implementation boundary:** Workflow documentation only; no application, account, or model-setting change to the active chat.
- **Acceptance criteria:** Luna · Low is the default; Sol · Low/Medium covers consequential analysis; High and Astra are not routine; the active task records its intended route and effort.
- **Validation:** Check current official OpenAI Docs and Codex model availability; review routing consistency and run `git diff --check`. No application tests needed.
- **Deliverables:** Updated agent/workflow instructions, task routes, and session handoff.
- **Commit title:** `docs(ai): prefer Luna for scoped work`.
- **Completion evidence (2026-10-27):** Official [model-selection guidance](https://developers.openai.com/api/docs/guides/model-selection) and [GPT-6 family guidance](https://developers.openai.com/api/docs/guides/latest-model) were reviewed. The current Codex model list includes `gpt-6-luna` and `gpt-6-sol` with Low/Medium effort. Routing was updated in `AGENTS.md`, `AI_DEVELOPMENT_WORKFLOW.md`, this queue, and `SESSION.md`. `git diff --check` passed. Editing documentation did not change the model running this chat; no application tests were needed.

## CX-008 — Establish the local frontend/backend startup path

- **Objective:** Give the owner exact, repository-backed steps to start the frontend and backend locally and understand which demo functions need each process.
- **Priority / status:** P1 / **DONE locally**. **Executor:** Codex.
- **Model and effort:** GPT-6 Luna · Low for bounded source inspection and documentation.
- **Dependencies:** None; CX-001 architecture discovery is available as context.
- **Inspect first:** Root and client READMEs, `run_frontend.ps1`, `run_backend.ps1`, `client/package.json`, Vite configuration, backend requirements, Flask entry points, environment examples, Dockerfiles and compose manifests if present, plus Git status.
- **Implementation boundary:** Document the commands and observed prerequisites. Determine whether Docker is actually configured. Do not add Docker, change configuration, install dependencies, start deployment, or alter data. Run a process only if its dependencies are already installed and the operation is safe; otherwise identify the missing prerequisite and stop.
- **Acceptance criteria:** A short local-start guide states prerequisites, exact PowerShell commands, expected local URLs/ports, which features need the backend, mock versus real model requirements, Docker availability, and any unverified steps. Distinguish inspected commands from successfully launched processes.
- **Validation:** Check commands against source scripts/manifests; if existing dependencies permit a safe launch, report the observed result. No application tests are required for documentation-only work.
- **Deliverables:** [Local startup guide](docs/architecture/LOCAL_DEVELOPMENT.md), updated `SESSION.md`, and completion evidence here.
- **Commit title:** `docs(dev): map local startup`.
- **Completion evidence (2026-10-27):** Inspected the README, both PowerShell launcher scripts, Vite/package settings, environment examples, Flask requirements and entry point, and searched for Docker/Compose files. No Docker configuration exists. The launcher scripts install packages automatically; manual no-install commands are documented in [LOCAL_DEVELOPMENT.md](docs/architecture/LOCAL_DEVELOPMENT.md). Existing venv imports passed and the Flask mock server started at `127.0.0.1:5000`, with PyTorch absent and lightweight fallback active. Vite binding and HTTP access were denied by this execution environment's socket policy, so browser and integration behavior remain unverified. No dependencies, configuration, or data were changed. Commit title: `docs(dev): map local startup`.

## CX-009 — Verify the local startup on the owner's machine

- **Objective:** Confirm the owner can open the frontend locally and reach the mock backend, or capture the exact failure for targeted troubleshooting.
- **Priority / status:** P1 / **WAITING_ON_OWNER**. **Executor:** Owner runs the app; Codex interprets any reported output.
- **Model and effort:** GPT-6 Luna · Low for routine troubleshooting; Sol · Low only if a security or architecture decision surfaces.
- **Dependencies:** CX-008 local startup guide.
- **Implementation boundary:** Run the commands in [LOCAL_DEVELOPMENT.md](docs/architecture/LOCAL_DEVELOPMENT.md) in two PowerShell terminals. Use mock mode and the synthetic demo image only. Do not upload real images/reports or paste secrets. No source changes or installs are part of this verification.
- **Acceptance criteria:** The local frontend opens at `http://127.0.0.1:5173`, and the public synthetic demo can reach the mock backend at `http://127.0.0.1:5000`; otherwise, exact console/terminal errors are available for diagnosis.
- **Validation:** Owner observes browser load and mock status/prediction flow, or supplies the error text with any secrets removed. No clinical or real-patient data.
- **Deliverables:** Owner's startup result; if a source-backed defect is found, a separate small implementation task with acceptance criteria.
- **Commit title:** `docs: verify local startup`.
- **Completion evidence (2026-10-27):** Owner confirmed the frontend opened and mock predictions worked using the local setup. Codex could not independently observe the browser because the execution sandbox denies local socket access. Commit title updated to the owner's requested unscoped form: `docs: verify local startup`.

## CX-010 — Decide whether the public demo needs a hosted prediction API

- **Objective:** Recommend whether to keep a hosted mock prediction endpoint or move simulated results into the browser so the public showcase can run as a static site.
- **Priority / status:** P1 / **DONE**. **Executor:** Codex prepared options; owner approved the direction.
- **Model and effort:** GPT-6 Sol · Low for security and architecture analysis; GPT-6 Luna · Low for bounded documentation edits.
- **Dependencies:** CX-001 demo/API contract, CX-003 characterization evidence, CX-005 public upload UI change, CX-009 successful local mock run, and approved D1/D4 directions.
- **Inspect first:** `docs/architecture/DEMO_CONTRACT.md`, `docs/architecture/ARCHITECTURE.md`, `client/src/services/modelService.js`, `client/src/views/DemoWorkspaceView.vue`, `server/app.py`, `server/model_service.py`, and ADR-002/003.
- **Implementation boundary:** Decision package only. No API removal, client rewrite, deployment, or provider/account change. Preserve annotation and simulated-result behavior in any recommendation.
- **Acceptance criteria:** Compare browser simulation with a hosted mock API by required behavior, image transmission, abuse/security surface, deployment complexity/cost, and observable parity. Account for the finding that the public UI has no upload controls while the API accepts image uploads directly. State unknowns and recommend one option for owner approval.
- **Validation:** Trace payload and response paths in source and existing characterization tests; do not add or run tests for this decision task. No real image or report data.
- **Deliverables:** [Options and recommendation](docs/architecture/CX010_PREDICTION_BOUNDARY.md), ADR-004, updated task/session state, and owner review gate.
- **Commit title:** `docs: decide public prediction boundary`.
- **Completion evidence (2026-10-27):** Traced demo file loading, request payload, unauthenticated Flask route, no-PyTorch error fallback, response adapter, view/report labels, and existing characterization tests. The [decision note](docs/architecture/CX010_PREDICTION_BOUNDARY.md) compares browser simulation, the current hosted Flask path, and a sample-ID-only hosted alternative. The owner approved browser simulation for public `/demo` with “passed, proceed 011”; ADR-004 records approval. No hosted service or deployment was selected. GPT-6 Sol was the exposed runtime model; Low was the selected task effort and actual effort was not exposed. Commit title: `docs: decide public prediction boundary`.

## CX-011 — Implement repeatable browser simulation in the public demo

- **Objective:** Replace `/demo`'s API-dependent prediction call with a repeatable client-side demo scenario while preserving the annotation showcase.
- **Priority / status:** P1 / **DONE**. **Executor:** Codex implemented; owner confirmed.
- **Model and effort:** GPT-6 Luna · Low for the scoped client change; GPT-6 Sol · Low only if new security or architecture evidence conflicts with the approved direction.
- **Dependencies:** CX-010 owner approval of browser simulation for public `/demo`; CX-003 existing characterization evidence.
- **Inspect first:** `client/src/views/DemoWorkspaceView.vue`, `client/src/services/modelService.js`, `client/tests/demo-contract.test.cjs`, and `docs/architecture/CX010_PREDICTION_BOUNDARY.md`.
- **Implementation boundary:** Public `/demo` only. Keep the old Python API and real local inference path intact. Use a small dedicated browser module for fixed scenario data; do not send an image or auth token to Flask from this route. No new backend, database, storage, sample radiograph asset, or deployment.
- **Acceptance criteria:** Repeated runs on the interim synthetic illustration return the same preset finding labels and valid 512×512 boxes, without displaying confidence percentages. Results and generated reports clearly say simulated and not diagnostic; avoid presenting IT2/IT3 or unverified metrics as active model output. Public demo prediction works with the Flask server stopped. Drawing, prediction overlays, CSV export, and report/PDF flow remain usable. Images and findings are not automatically persisted.
- **Validation:** Focused tests prove stable fixture output, explicit simulated provenance, and that the demo does not call the prediction method. Node tests, targeted ESLint, and Vite production build passed. Manual browser path, PDF rendering, and network-panel checks are deferred until planned development is complete, per owner direction (2026-10-27).
- **Deliverables:** Dedicated simulation module, focused characterization/update tests, updated demo wording and contract documentation, and `SESSION.md` evidence.
- **Commit title:** `feat: simulate demo predictions in browser`.
- **Completion evidence (2026-10-27):** Owner approved CX-010 with “passed, proceed 011.” Added fixed, cloned 512×512 finding fixtures in `client/src/services/demoSimulation.js`; `/demo` no longer calls `ModelService.predict`, sends images, or presents IT2/IT3 or confidence percentages. The result panel, overlay, action, and generated report label preset output as simulated/not image analysis. Manual annotation, CSV export, report generation, and PDF invocation remain wired. `node --test client/tests/demo-contract.test.cjs` passed 8/8; targeted ESLint passed with only an existing Browserslist data-age notice; `npm run build` passed with the existing large-chunk warning. Browser verification with Flask stopped and actual PDF rendering were blocked by sandbox socket access and remain owner checks. No server, config, dependencies, persistence, or deployment changed. GPT-6 Luna was the exposed runtime model; Low was selected, runtime effort was not exposed. Commit title: `feat: simulate demo predictions in browser`.
- **Owner direction (2026-10-27):** Owner confirmed CX-011 and deferred manual testing/bug fixes until planned development is complete. Do not make manual browser validation a blocker for subsequent planned work; preserve it as an end-stage validation gate.

## CX-012 — Review an owner-selected chest X-ray sample

- **Objective:** Review the owner-selected project sample, its visible content/metadata, and the project dataset source references for the public research demo.
- **Priority / status:** P1 / **DONE**. **Executor:** Owner supplied the sample/dataset context; Codex performed source and file review.
- **Model and effort:** GPT-6 Luna · Low for file/provenance extraction; GPT-6 Sol · Low for rights/privacy analysis; Sol · Medium only if evidence conflicts.
- **Dependencies:** CX-011 owner confirmation received; owner supplied the sample and identified the two public datasets used by project training/validation.
- **Inspect first:** `docs/architecture/SAMPLE_PROVENANCE.md`, the owner-provided source/license terms, and the exact candidate file (when supplied).
- **Implementation boundary:** Provenance and privacy review only until the owner approves that exact asset. Do not download from unrelated mirrors, add an image, or alter the file during review. No patient report or identifiable data.
- **Acceptance criteria:** Record owner-provided source context, visible-content review, format and embedded-metadata findings, attribution, hosting suitability, and any provenance or terms limitation. Distinguish owner-provided context from independently verified image-level facts; do not imply clinical usefulness.
- **Validation:** Review the current source pages and inspect the supplied PNG container/visible rendering deterministically; record that its exact dataset ID is unavailable.
- **Deliverables:** Updated provenance note and implementation handoff for CX-013.
- **Commit title:** `docs: review demo image provenance`.
- **Completion evidence (2026-10-27):** The owner identifies the attached sample as from the project training/validation datasets and states it contains no PII. PNG inspection found 474×474 RGB with only IHDR/IDAT/IEND chunks; visible `PORTABLE`, `AP`, and `L` markers and no obvious name/date overlay. Exact image ID/source dataset cannot be matched from the flattened attachment. NIH attribution requires an NIH source link, Wang et al. CVPR 2017 citation, and NIH Clinical Center acknowledgment; Kaggle bbox re-upload license was not exposed. VinDr-CXR maintainer terms prohibit sharing; this remains documented as a caveat if the exact sample is later identified as VinBigData. The owner directed use of this sample and project dataset references for the research demo. Commit title: `docs: review demo image provenance`.

## CX-013 — Add one owner-approved chest X-ray sample to the public demo

- **Objective:** Add the owner-approved project sample to the public demo with dataset references and clear non-diagnostic labeling.
- **Priority / status:** P1 / **DONE**. **Executor:** Codex implemented the owner-directed sample integration.
- **Model and effort:** GPT-6 Luna · Low for bounded asset integration; GPT-6 Sol · Low only if a privacy or security question arises.
- **Dependencies:** CX-012 source review complete; owner explicitly directed use of the supplied sample and identified the project datasets. The attached rendering's exact record match remains unverified and documented.
- **Inspect first:** CX-012 provenance evidence, approved exact file/checksum, current demo sample-loading path, and focused demo contract tests.
- **Implementation boundary:** Add only the approved image and minimum sample-loader/attribution changes. Do not add reports, patient data, persistence, upload/network transmission, unrelated assets, backend, or deployment changes.
- **Acceptance criteria:** The owner-selected image loads as the public sample, dataset references and research-only warnings appear, annotation/simulated results still work, and no image/report is sent for prediction or retained automatically.
- **Validation:** `node --test client/tests/demo-contract.test.cjs` passed 8/8; `npm run lint` passed with the existing 9-month Browserslist data notice; `npm run build` passed with the existing >500 KB html2pdf chunk warning. Manual browser checks are deferred by owner direction.
- **Deliverables:** Bundled owner-provided sample, sample loader, visible dataset references and watermark, updated provenance and demo contract.
- **Commit title:** `feat: add approved demo image`.

## CX-014 — Audit public-route backend dependencies

- **Objective:** Determine which visitor-facing routes still call Flask/API services and what that means for a static public demo and eventual hosting choice.
- **Priority / status:** P1 / **DONE**. **Executor:** Codex audited; owner approved recommendation.
- **Model and effort:** GPT-6 Sol · Low for security/architecture review; GPT-6 Luna · Low for bounded route tracing and documentation.
- **Dependencies:** CX-011 owner confirmation; approved ADR-002/004 public-demo direction. Manual browser testing is deferred and is not a prerequisite for this source audit.
- **Inspect first:** `client/src/router/index.js`, public-facing views and imported services, `client/src/services/modelService.js`, `client/src/services/authService.js`, `server/app.py`, `docs/architecture/ARCHITECTURE.md`, and existing demo contract.
- **Implementation boundary:** Read-only source audit plus documentation. Do not remove routes, APIs, sign-in, or dependencies; do not change hosting, configuration, or deployment.
- **Acceptance criteria:** Produce a route-by-route map of API calls and data sent/received; classify each as static-compatible, needs an API, or unclear; identify direct upload/privacy/security implications and minimum hosting shape implied. Distinguish legacy researcher paths from the intended public showcase. State what source inspection cannot prove without manual testing.
- **Validation:** Trace imports/call sites deterministically and cross-check against current route definitions and API endpoints. No manual browser validation or bug fixing in this phase.
- **Deliverables:** Concise route dependency audit, updated architecture/handoff, and a later hosting task if evidence supports it.
- **Commit title:** `docs: audit public route dependencies`.

**Completion evidence:** [CX-014 route audit](docs/architecture/CX014_PUBLIC_ROUTE_DEPENDENCIES.md) and the linked architecture update document all nine routes, concrete HTTP calls, static compatibility, security/privacy implications, and unverified hosted behavior. `git diff --check` passed. Owner approved the public-build boundary by “done 014”. No hosting change.

## CX-015 — Isolate static showcase routes

- **Objective:** Give the public static build an explicit route/navigation boundary so visitors see only `/`, `/demo`, `/research`, `/metrics`, and `/about`; retain login, home, annotation, upload, and Flask workflows in local development.
- **Priority / status:** P1 / **DONE**. **Executor:** Codex implemented; owner approved 2026-10-27.
- **Model and effort:** GPT-6 Luna · Low for scoped code/tests/docs; GPT-6 Sol · Low only for a newly surfaced security decision.
- **Dependencies:** Owner approves CX-014's proposed public-build boundary. `passed, proceed 015` records that approval and authorizes this task.
- **Inspect first:** `docs/architecture/CX014_PUBLIC_ROUTE_DEPENDENCIES.md`, `client/src/router/index.js`, `client/src/components/PublicTopNav.vue`, `client/src/App.vue`, relevant landing links, `client/package.json`, and focused route tests.
- **Implementation boundary:** Small frontend build-mode/route/navigation slice. Preserve local researcher routes and Flask; no deployment, provider/account/configuration change, real data, feature deletion, or backend authorization redesign.
- **Acceptance criteria:** Public build navigation has no login or protected-workflow entry points; direct legacy URLs have an intentional public result; local development behavior remains available. Research/demo disclaimers remain visible. No public visitor action calls Flask. Capture route behavior in focused deterministic tests.
- **Validation:** Focused route/navigation tests, targeted lint and production build. Manual browser/network validation and bug fixes remain end-stage work by owner direction.
- **Deliverables:** Reviewable frontend boundary, focused tests, updated architecture/session; no hosting action.
- **Commit title:** `feat: isolate public demo routes`.

**Completion evidence:** `router/index.js` registers five showcase routes for production and retains legacy login/researcher routes for local development; the unknown-path fallback redirects to `/`. The public demo now uses a local color map rather than importing `modelService`, so the production demo chunk does not pull in the local API URL. `node --test tests/demo-contract.test.cjs` passed 8/8; targeted ESLint on the router and demo view passed with the existing stale Browserslist-data notice; `npm run build` passed with the existing large demo chunk warning. Generated `dist/assets` search found no `localhost:5000`, `/api/predict`, `/api/model-status`, `check-session`, or legacy page component chunks. `git diff --check` passed. Manual browser/network validation remains deferred. Owner approved with “015 approved. proceed 016”.

## CX-016 — Prepare Vercel static preview release plan

- **Objective:** Verify current Vercel static Vite hosting requirements for the five-route public build and prepare an owner-operated preview release procedure.
- **Priority / status:** P1 / **DONE**. **Executor:** Codex prepared the review package; owner approved the plan; owner operates account and deployment steps.
- **Model and effort:** GPT-6 Sol · Low for provider/release architecture; GPT-6 Luna · Low for deterministic artifact/configuration checks.
- **Dependencies:** Owner review of CX-015's public route boundary and generated production bundle. `passed, proceed 016` authorizes the recorded scope.
- **Inspect first:** CX-014 route audit, `client/vercel.json`, `client/package.json`, `client/vite.config.js`, Vercel's current official Vite, Hobby plan, and deployment documentation.
- **Implementation boundary:** Documentation and local artifact verification only. Do not create accounts, accept terms, change DNS, configure secrets, deploy previews/production, add backend services, or alter the selected host without owner review.
- **Acceptance criteria:** Document current plan eligibility/limitations, build and output settings, SPA deep-link behavior, direct-route checks, preview privacy, expected costs, required owner actions, rollback, and release gates. State which details must be reconfirmed at execution time.
- **Validation:** Verify statements against official current provider documents; deterministic local production build/artifact checks. No browser testing requirement until the end-stage validation pass.
- **Deliverables:** Concise provider-specific release plan and updated architecture/session; no deployment.
- **Commit title:** `docs: prepare static preview release plan`.

**Completion evidence:** [CX-016 Vercel preview plan](docs/architecture/CX016_VERCEL_PREVIEW_PLAN.md) uses current official Vercel Vite, monorepo, build, Hobby, limits, protection, and rollback documentation. It records local build artifact/configuration evidence and the owner-operated preview and release gates. The owner approved the plan with “approved. proceed 017”. This did not authorize or perform account setup or deployment; Hobby eligibility and final host selection remain owner decisions.

## CX-017 — Trace public metric provenance

- **Objective:** Map every quantitative claim shown on the public metrics/research pages to a specific training run, dataset split, evaluation method, and source artifact in the separate model-training repository, or label it unverified.
- **Priority / status:** P1 / **DONE**. **Executor:** Codex traced evidence; owner approved conservative treatment through `proceed 017-020`.
- **Model and effort:** GPT-6 Luna · Low for bounded extraction; GPT-6 Sol · Low for scientific-claim interpretation, Medium only if evidence conflicts.
- **Dependencies:** Owner reviews CX-016 release plan and authorizes this publication-evidence task; D6 requires verified mapping before exact metric publication. `passed, proceed 017` authorizes the recorded scope.
- **Inspect first:** `client/src/views/MetricsDashboardView.vue`, `ResearchView.vue`, `docs/architecture/DECISIONS.md` D6, and only the relevant notebooks/results/README in the separate training repository.
- **Implementation boundary:** Evidence mapping and recommendation only. Do not change metrics, train models, download weights/data, install dependencies, alter the public site, or publish claims in this task.
- **Acceptance criteria:** Table of each visible number with source file/run, metric definition, split, checkpoint, confidence in match, and exact gaps; recommendation for retain, qualify, or withhold each claim. No estimate masquerades as an observed score.
- **Validation:** Deterministic source and artifact cross-check; no application suite or manual browser test for this documentation task.
- **Deliverables:** Short metrics provenance note, updated architecture/session, owner decisions needed before release.
- **Commit title:** `docs: trace public metric provenance`.

**Completion evidence:** [CX-017 metric provenance](docs/architecture/CX017_METRIC_PROVENANCE.md) pins the separate training repository and maps UI values to saved notebook cells and splits. Epoch-150 `0.0092` mAP, epoch-260 `0.3102` mAP and area AR values match; Iteration 2 `0.0079`, exact AUC numbers and PR curves lack a verified numeric artifact. The later training run uses six classes despite nine listed on the research page. The owner authorized the conservative public-content treatment with `proceed 017-020`.

## CX-018 — Align public research claims

- **Objective:** Apply the owner-approved CX-017 evidence decisions to the public Metrics and Research pages in one coherent content milestone.
- **Priority / status:** P1 / **DONE locally**. **Executor:** Codex implemented; owner reviews result.
- **Model and effort:** GPT-6 Luna · Low for scoped UI edits and documentation; GPT-6 Sol · Low for a final scientific-claim check.
- **Dependencies:** Owner reviews `CX017_METRIC_PROVENANCE.md` and approves the dashboard wording/chart treatment. `passed, proceed 018` approves the conservative recommendation below unless the owner names a different treatment.
- **Inspect first:** CX-017 note, `client/src/views/MetricsDashboardView.vue`, `ResearchView.vue`, directly relevant chart component and focused tests.
- **Implementation boundary:** Public Metrics and Research content only. Retain both pages and verified epoch-150/260 results; no model/data changes, re-evaluation, hosting action, or unrelated page redesign. Do not remove a feature without owner review.
- **Conservative treatment for owner review:** Label measured mAP and area AR as saved validation outputs with iteration/epoch and split context. Replace unsupported Iteration 2 and exact AUC numbers with clear “not yet verified” copy or illustrative labels. Make the precision/recall explanation and chart direction internally consistent, retaining an explicit schematic/demo label if no measured source exists. Distinguish source-dataset totals, the 4,850-image preprocessing count, and the six-class later run from nine-class earlier/UI behavior in Research.
- **Acceptance criteria:** Every remaining exact result has a source-backed caption or unmistakable illustrative label; no invented value is presented as measured; chart text matches the chart; Research claims identify which run/class set they describe; research-only language remains visible.
- **Validation:** Focused source/contract checks, targeted lint and build. Manual browser checks remain deferred until end-stage validation.
- **Deliverables:** Reviewable Metrics and Research change, evidence-aligned note and session update. Group with CX-017 documentation in one commit if the owner chooses to commit the milestone.
- **Suggested grouped commit title:** `fix: align public research claims`.

**Completion evidence:** Both pages distinguish saved validation outputs from a controlled comparison, withhold unsupported exact AUC/Iteration 2 values, label the schematic chart, and distinguish dataset/preprocessing counts and class sets. Targeted ESLint, focused 8/8 tests, production build and browser rendering passed. See [release readiness](docs/architecture/CX019_CX020_RELEASE_READINESS.md). No commit or deployment was created.

## CX-019 — Stabilize the public demo locally

- **Objective and scope:** Exercise the five-route static build with Flask stopped, fix observed release-facing copy, navigation, responsive and annotation defects, and record export evidence.
- **Priority / status:** P1 / **DONE locally**. **Dependencies:** CX-018 locally complete; owner authorized CX-019 through `proceed 017-020`.
- **Implementation boundary:** Public frontend only; no hosted backend, data store, account, model, or production deployment.
- **Acceptance and validation:** [Release readiness](docs/architecture/CX019_CX020_RELEASE_READINESS.md) records browser checks of five public routes, sample/simulation, annotation and CSV/PDF export with Flask stopped. The clipped landing header, incorrect public workflow wording, About placeholders, broken overview anchor, and native image drag were fixed. Targeted lint, 8/8 contract tests, build, narrow-viewport recheck and `git diff --check` passed. Full live request logs, hosted preview and wider responsive checks remain CX-020 gates.
- **Deliverables:** Public frontend fixes and local validation note. **Model / effort:** GPT-6 Luna · Low recommended for scoped work; actual environment exposed GPT-6 Sol for this turn. **Suggested grouped commit:** `fix: align public research demo`.

## CX-020 — Protected preview and public release

- **Objective and scope:** Have the owner operate a protected Vercel preview of the reviewed static build, collect preview parity evidence, then decide whether to open production access.
- **Priority / status:** P1 / **WAITING_ON_OWNER**. **Dependencies:** CX-017–019 local evidence complete; owner confirms sample publication and current Hobby eligibility, selects the reviewed repository/branch and connects the account. A preview must exist before hosted checks can be marked complete.
- **Implementation boundary:** The owner operates account setup, terms, billing, production deployment, DNS, and final cutover. Codex can review preview evidence and repair observed repository defects. Do not add Flask, Supabase, secrets or real patient data to the static host.
- **Acceptance criteria:** Protected preview build and commit SHA are recorded; five direct routes and local-only fallback pass; sample/drawing/simulation/CSV/PDF and corrected research claims match local behavior; actual browser request log shows no unexpected backend/image transfer; narrow and wider layout plus constrained-load behavior are acceptable; rollback/withdrawal is ready. Public release requires explicit owner approval after those checks.
- **Validation:** Use the [readiness checklist](docs/architecture/CX019_CX020_RELEASE_READINESS.md) and [Vercel plan](docs/architecture/CX016_VERCEL_PREVIEW_PLAN.md) on the deployed preview. No Vercel project/link or deployment was found locally, so hosted validation remains open.
- **Deliverables:** Preview evidence, any focused fixes, and owner release decision. **Model / effort:** GPT-6 Sol · Low for release judgment; GPT-6 Luna · Low for routine checks. **Suggested commit if repository changes are needed:** `docs: prepare public release`.

## Queue rule

The owner supplied and approved a sample, identified the NIH Bbox and VinBigData datasets as project training/validation sources, and stated the sample has no PII. Exact per-image source matching remains unverified. CX-016 remains the approved host plan; CX-017–019 now provide local claim and demo evidence. Do not retire legacy sign-in or duplicate screens without owner review. Keep completed detail below the active roadmap, and archive it if the file becomes hard to use.
