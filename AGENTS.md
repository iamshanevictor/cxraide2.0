# Agent instructions

Read this file, `SESSION.md`, the selected `READY` task in `PROJECT_TASKS.md`, its directly relevant sources/tests, and Git status at the start of a session. Do not rescan the repository without a concrete uncertainty.

## Source of truth

1. Current user instructions and approved decisions in `docs/architecture/DECISIONS.md`.
2. Running code and focused tests for implemented behavior.
3. `REQUIREMENTS.md` for approved product scope; `docs/architecture/ARCHITECTURE.md` for the architecture map.
4. `PROJECT_TASKS.md` for the active queue; `SESSION.md` for the handoff. Older `README.md`, `SECURITY_GUIDE.md`, and `TODO.md` are historical context where they disagree.

Separate observed behavior, inference, and proposal. Do not turn a proposal into an approved decision without owner review. Preserve useful behavior before refactoring it.

## Boundaries

- CXRaide is currently a public research demo, not a clinical service. Hosted results are simulated; real model inference is local with separately downloaded weights. Label simulated results and keep research-only disclaimers visible.
- Do not store identifiable patient images or reports. Use synthetic or approved non-identifiable fixtures. Do not put secrets, model weights, or real personal data in Git, tests, logs, screenshots, or prompts.
- The browser owns presentation and local drawing. A future verified server boundary must own consequential input validation and authorization. Derive record ownership from verified identity, never from a normal browser-supplied owner ID. Put each business rule in one authoritative place.
- Preserve explicit date/time semantics in reports. If financial features are ever added, define exact representations and rounding before implementation; JavaScript floating point must not become authoritative money.

## Work and validation

- Work from the one `READY` task. Check its dependencies and acceptance evidence before changing its status. Keep changes small and reviewable; characterize existing behavior before migrating it. Validate at the owning boundary, then integration and release gates where applicable.
- Use deterministic tools for routine checks. Match validation to the change; Markdown-only work does not require application suites. Record failures and unverified checks plainly in `SESSION.md`.
- Inspect Git status before and after work. Preserve unrelated changes. Do not commit automatically. Do not delete or retire a feature without owner review.
- Give every task an exact proposed commit message that includes its task ID. Include that message in the task completion report even when no commit is created.
- Account creation, billing, DNS, production deployment, use of real data, destructive data actions, and final cutover are owner-operated gates. Prepare a reviewable plan and evidence first.

Model routing and task format are in `AI_DEVELOPMENT_WORKFLOW.md` and `PROJECT_TASKS.md`.
