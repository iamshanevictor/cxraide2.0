# Project Development Queue

Last updated: 2026-10-27

## Project Goal

Maintain CXRaide as a public, research-only chest X-ray annotation showcase. Visitors should be able to try a sample image, draw annotations, and see clearly simulated results. Separately downloaded real models remain available for local research use. The public demo must not store identifiable patient images or reports. Radiologist accounts and persistent records are future concepts, not current implementation requirements. See [requirements](REQUIREMENTS.md) and the [architecture map](docs/architecture/ARCHITECTURE.md).

## Current State

- CX-001 discovery, CX-003 characterization, and CX-004 image-retention change are complete locally. The Flask application was not changed.
- There is no active database, durable job system, or authoritative legacy data. Focused dependency-free contract tests now cover the demo and route boundaries.
- The current demo's `Load sample` action generates a synthetic gradient/noise image rather than a sample chest X-ray. The demo still exposes visitor upload, pending approved sample provenance and D1 implementation. CX-004 stopped automatic browser image retention and clears the two legacy keys on mount.
- Hosted results are intended to be simulated. Real inference works locally with separately downloaded weights, according to the owner; weights and runtime inference were not available for this assessment.
- The owner approved CX-002's D1–D7 directions on 2026-10-27. ADR-002/003 record them; D2 is implemented at the source/test boundary, while D1 and the broader target remain incomplete. Metric-to-run mapping, sample rights, and host eligibility remain evidence gates.
- CX-003's synthetic contract tests captured the former browser image retention, display-pixel CSV, PyTorch-text-only client fallback, and IT2/IT3 mode-selection defects. No real weights or installed application dependencies were available.

## Quick Queue

**CX-005 is the sole `READY` task.** It addresses the approved sample-only public input using the CX-001/003 evidence. Status and dependency evidence govern promotion; table order alone does not.

| ID | Status | Priority | Route | Executor | Task | Depends on | Validation gate |
|---|---|---|---|---|---|---|---|
| CX-001 | DONE locally | P0 | Luna · Low; Sol · Medium only for unresolved privacy/architecture judgment | Codex | Verify public demo contract and privacy paths | None | Source-backed contract table and updated handoff complete |
| CX-002 | DONE | P0 | GPT-6.1 Sol · Medium | Owner + Codex documentation | Confirm demo, sample, sign-in, and hosting decisions | CX-001 evidence | D1–D7 approved; ADRs and requirements updated |
| CX-003 | DONE locally | P1 | GPT-6.1 Sol · Low; Medium for cross-layer inference | Codex | Characterize approved demo and inference behavior | CX-001 and CX-002 | 5 Node and 5 Python contract tests passed |
| CX-004 | DONE locally | P1 | GPT-6.1 Sol · Low | Codex | Stop automatic public-demo image retention | CX-003 | 5 focused client tests passed; browser run pending |
| **CX-005** | **READY** | P1 | GPT-6.1 Sol · Low | Codex | Restrict public demo UI to sample input | CX-001/003 and D1 approval | No visitor upload control on `/demo`; annotation/export retained |

## How to Use This File

1. Read `AGENTS.md`, `SESSION.md`, Git status, and the selected `READY` task if one exists; then inspect only directly relevant sources/tests.
2. Follow the task's bounded scope and route; check model availability when beginning a task.
3. Record observations separately from inferences. Complete task-specific validation and note checks that could not run.
4. Record local completion evidence and update `SESSION.md`. Promote a dependent task only when each prerequisite's required evidence exists. Keep hosted and owner acceptance separate.
5. Update an ADR for a consequential decision. Archive lengthy completed details if the live queue becomes hard to scan. Do not invent tasks when the queue is exhausted.
6. Give every task an exact Conventional Commit title with an optional code-area scope and a `Refs:` footer for its task ID. Repeat it in the completion report. This names a reviewable change; it does not create a Git commit automatically. The recorded CX-003 title predates this scope preference and matches the existing commit.

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
- **Recommended model:** Luna · Low for bounded extraction; GPT-6.1 Sol · Medium if privacy/architecture conflicts require judgment.
- **Implementation prompt:** Map only the current public demo's sample, prediction, annotation, export, upload, and retention paths. Produce source-backed contract evidence, update the architecture note and session handoff, and record unverified behavior. Do not implement or install anything.
- **Commit message:** `docs(architecture): map public demo contract and privacy paths` with footer `Refs: CX-001`.
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
- **Recommended model:** GPT-6.1 Sol · Medium.
- **Implementation prompt:** After CX-001, present the verified public-demo choices and hosting tradeoffs to the owner. Record explicit answers in the ADRs and requirements. Do not treat a proposal or silence as approval.
- **Commit message:** `docs(architecture): record public demo and hosting decisions` with footer `Refs: CX-002`.
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
- **Recommended model:** GPT-6.1 Sol · Low for scoped tests; Medium for cross-layer inference interpretation.
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
- **Commit message:** `fix(demo): stop automatic image retention` with footer `Refs: CX-004`.
- **Completion evidence (2026-10-27):** `DemoWorkspaceView.vue` no longer reads files into data URLs for storage or restores a prior image. On mount, it removes `cxraide_last_image` and `cxraide_last_image_name` in a guarded cleanup. The public hint now says images are not saved between visits. Updated synthetic contract test checks legacy cleanup, zero storage writes, an in-memory loaded file, and a fresh view with no restored image. Existing drawing/CSV and report/PDF-invocation contract tests still pass. `node --test client/tests/demo-contract.test.cjs` passed 5/5. Browser interaction, actual PDF rendering, and client lint/build remain unverified because `client/node_modules` is absent. No dependency, account, cloud or deployment action was performed.

## CX-005 — Restrict public demo UI to sample input

- **Objective and bounded scope:** Align `/demo` with approved D1 by removing visitor file selection and drop controls from the public view while preserving the internal file-loading path for the sample and possible later reviewed modes.
- **Priority / status:** P1 / **READY**. **Executor:** Codex.
- **Dependencies:** CX-001 upload-path evidence, CX-003 tests, and owner approval of D1 are recorded. CX-004 is complete.
- **Inspect first:** `client/src/views/DemoWorkspaceView.vue`, `client/tests/demo-contract.test.cjs`, ADR-002 and `REQUIREMENTS.md`.
- **Implementation boundary:** Public demo UI only. Preserve upload-capable code for later local research/radiologist review; do not add an unapproved chest X-ray asset, rewrite inference, or deploy.
- **Acceptance criteria:** Public demo exposes no picker/drop upload action; its existing synthetic sample still supports annotation, prediction request, CSV and report generation. The page clearly calls that interim image synthetic until a sourced radiograph is approved.
- **Validation:** Update and run focused synthetic client tests; run lint/build if dependencies become available; record browser limits and the remaining sample-provenance gate.
- **Deliverables:** Small UI/test change and `SESSION.md` evidence.
- **Commit message:** `fix(demo): restrict public image input to samples` with footer `Refs: CX-005`.
- **Completion evidence:** Pending.

## Queue rule

After CX-005, assess owner requests and concrete defects, then add the smallest justified next task. Do not retire the legacy sign-in or duplicate screens without owner review. Archive completed task detail when it makes this file hard to scan.
