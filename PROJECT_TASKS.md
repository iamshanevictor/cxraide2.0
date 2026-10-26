# Modernization task queue

Status vocabulary: `PROPOSED`, `READY`, `IN_PROGRESS`, `BLOCKED`, `WAITING_ON_OWNER`, `DONE`, `CANCELLED`. Exactly one task is `READY`. A dependency is complete only after its required validation evidence is recorded here or linked from its deliverable. `DONE` for local work does not imply hosted or owner acceptance. Do not create a detailed implementation backlog from uninspected code.

## CX-001 — Verify the public demo contract and privacy boundary

- **Objective and bounded scope:** Map the public sample-image, simulated prediction, manual annotation, export, public-upload, and browser-retention paths. Trace inputs/outputs in `DemoWorkspaceView.vue`, `modelService.js`, and relevant Flask routes. Record what runs without a backend and what currently depends on it. This is read-only discovery.
- **Priority / status:** P0 / **READY** — the single next task.
- **Dependencies:** None.
- **Inspect first:** `REQUIREMENTS.md`; `client/src/views/DemoWorkspaceView.vue`; `client/src/services/modelService.js`; `client/src/router/index.js`; `server/model_service.py` route signatures.
- **Implementation boundaries:** Documentation and evidence only. No application edits, dependency installation, production account work, or real data.
- **Acceptance criteria:** A short contract table covers sample origin, each simulation path, manual-box coordinate meaning, CSV/PDF outputs, upload handling, browser persistence, and research-only labels. Distinguish observed facts from assumptions. Identify any current path that could retain or send an identifiable image.
- **Required tests and manual validation:** Source review and targeted static checks; no app test suite required. If a safe local run is already available without installing anything, record observations separately; it is not required for completion.
- **Expected deliverables:** Contract evidence added to `docs/architecture/ARCHITECTURE.md` or a linked concise note; updated `SESSION.md`; proposed follow-up only for verified gaps.
- **Recommended model:** Luna · Low for bounded extraction; GPT-6.1 Sol · Medium if privacy/architecture conflicts require judgment.
- **Suggested commit:** `docs: map public demo contract and privacy paths`
- **Completion evidence:** Pending.

## CX-002 — Confirm product and hosting decisions

- **Objective and bounded scope:** Review ADR-002/003 and decide public-upload policy, whether the hosted demo needs any Flask API, sample-image provenance, and the scope of radiologist sign-in. Record the separate research repository URL and the metric-to-UI mapping.
- **Priority / status:** P0 / **WAITING_ON_OWNER**.
- **Dependencies:** CX-001 evidence, so the owner can review concrete paths.
- **Inspect first:** `REQUIREMENTS.md`; `docs/architecture/DECISIONS.md`; CX-001 contract; `README.md` deployment section.
- **Implementation boundaries:** Decision and documentation only. No cloud setup, billing, DNS, deployment, or application change.
- **Acceptance criteria:** Owner explicitly accepts or revises each scope decision; ADR statuses and `REQUIREMENTS.md` reflect the answer; provider eligibility and actual free-plan fit are rechecked at selection.
- **Required tests and manual validation:** Consistency review across requirements, ADRs and architecture; no application tests.
- **Expected deliverables:** Dated ADR update, revised scope, hosting choice or a clearly stated remaining decision.
- **Recommended model:** GPT-6.1 Sol · Medium.
- **Suggested commit:** `docs: record public demo and hosting decisions`
- **Completion evidence:** Pending owner review; this task cannot become `READY` until CX-001 is complete.

## CX-003 — Characterize existing demo and inference behavior

- **Objective and bounded scope:** Add focused tests for approved public-demo behavior and the existing mock/real inference contract, including mode selection and failure labeling. Use synthetic images and no model weights in Git.
- **Priority / status:** P1 / **PROPOSED**.
- **Dependencies:** CX-001 and CX-002 completed with recorded evidence.
- **Inspect first:** Approved demo contract; `client/src/views/DemoWorkspaceView.vue`; `client/src/services/modelService.js`; `server/app.py`; `server/model_service.py`; test/tool manifests.
- **Implementation boundaries:** Tests and only minimal testability seams; no feature rewrite, new persistence, account provider, or deployment. Local model validation requires owner-supplied trusted weights outside Git.
- **Acceptance criteria:** Tests distinguish simulated and real paths, preserve useful manual-box/export behavior, and demonstrate any verified mode-selection or mock fallback defects without asserting clinical accuracy.
- **Required tests and manual validation:** Run only the added focused tests and existing relevant lint/build when dependencies are available; review representative synthetic CSV/PDF output and record unrun gates.
- **Expected deliverables:** Focused characterization tests, test commands/results, and updated `SESSION.md`.
- **Recommended model:** GPT-6.1 Sol · Low for scoped tests; Medium for cross-layer inference interpretation.
- **Suggested commit:** `test: characterize public demo and inference contract`
- **Completion evidence:** Pending. Local test success and hosted acceptance must be recorded separately.

## Queue rule

After these tasks, assess owner requests and concrete defects, then add the smallest justified next task. Do not retire the legacy sign-in or duplicate screens without owner review. Archive completed task detail when it makes this file hard to scan.
