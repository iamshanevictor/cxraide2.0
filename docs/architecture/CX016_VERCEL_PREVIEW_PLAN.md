# CX-016 — Vercel static preview plan

Checked 2026-10-27 against current Vercel documentation and the local repository. This is a release plan for the owner to review, not a deployment authorization.

## Fit and expected cost

The public build is a Vite single-page application with five showcase routes, a bundled sample, local annotation/export, and browser-simulated findings. It needs static hosting only. Vercel documents [Vite support and the SPA rewrite](https://vercel.com/docs/frameworks/frontend/vite). Supabase, Flask, model weights, secrets, a database, and server functions are not needed for this public build.

[Hobby is free](https://vercel.com/docs/plans/hobby) for eligible **personal, noncommercial** projects. A solo research showcase appears consistent with that description, but only the owner can confirm that the actual account and project use satisfy Vercel's [fair-use policy](https://vercel.com/docs/limits/fair-use-guidelines). If eligible and within included usage, expected hosting charge is $0. Current [limits](https://vercel.com/docs/limits) include 100 GB monthly Fast Data Transfer, 100 deployments per day, one concurrent build, a 45-minute build ceiling, and 100 MB per static file upload. Vercel says Hobby usage can pause when its included allowance is exceeded; traffic has not been measured, so availability under real traffic is unverified. Recheck plan terms and limits when creating the project.

## Project settings to review in the Vercel dashboard

| Setting | Proposed value | Reason/evidence |
|---|---|---|
| Git repository | This repository, under the owner's eligible personal account | Git connection and account are owner-operated. [Monorepo setup](https://vercel.com/docs/monorepos) selects a project root. |
| Root Directory | `client` | `package.json`, `vite.config.js`, and `vercel.json` live there; Vercel reads configuration relative to the project root. |
| Framework Preset | Vite | Matches the existing client. Confirm Vercel detects it. |
| Build Command | `npm run build` | Existing `client/package.json` script runs `vite build`. [Build settings](https://vercel.com/docs/builds/configure-a-build) can detect or override this. |
| Output Directory | `dist` under `client` | Vite's local build emits `client/dist`; only the selected output directory is served statically. |
| Install Command | Vercel's detected npm install from the committed lockfile | `client/package-lock.json` exists. Confirm dashboard detection rather than introducing a new dependency or command. |
| Environment variables | No backend URL or secret needed for the public build; keep `VITE_BASE_URL` unset or `/` | The public bundle uses root-relative routes and does not need Flask. `VITE_` values are browser-visible at build time. |
| Routing | Keep `client/vercel.json` rewrite `/(.*)` → `/index.html` | Matches Vercel's documented SPA deep-link pattern. The Vue router resolves unknown and local-only paths to `/`. |
| Deployment Protection | Vercel Authentication with Standard Protection for previews; public production domain only after release approval | [Standard Protection](https://vercel.com/docs/deployment-protection) covers previews and generated deployment URLs while leaving production domains public. Vercel now also documents free All Deployments protection if the owner needs to close the site temporarily. |

No account, dashboard setting, domain, or deployment was changed in CX-016. Git-connected projects may automatically build on pushes; the owner should review the production branch and deployment controls before linking the repository. [Vercel's deployment guide](https://vercel.com/docs/deployments/promoting-a-deployment) describes automatic production promotion from the production branch.

## Local evidence and preview procedure

The last local `npm run build` passed, emitting the five showcase page chunks, the sample asset, and `index.html`. A bounded search of the generated assets found no `localhost:5000`, `/api/predict`, or legacy page chunks. The demo chunk still triggers Vite's size warning (about 997 KB before gzip, 288 KB gzip); this is a load-performance concern to measure later, not a build failure. `client/vercel.json` is valid JSON and matches Vercel's published SPA rewrite shape. These are local artifact checks; Vercel's build, route handling, browser networking, and PDF export have not been observed.

After the owner approves the release candidate and connects an eligible personal account:

1. Set Root Directory to `client` and confirm the settings above before allowing a production-branch deployment. Prefer a protected preview of a reviewed commit first. Do not submit identifiable images or reports.
2. Confirm the preview build succeeds and its artifact contains only the public pages. Record the commit SHA and preview URL outside the repository if it contains account-specific information.
3. At the end-stage manual validation pass, open `/`, `/demo`, `/research`, `/metrics`, and `/about` directly and through navigation; direct `/login`, `/home`, `/annotate`, and `/upload-cxr` requests should land at `/`. Check that the sample, simulated labels, watermark, annotation, CSV/PDF export, and research-only language render. With Flask stopped, inspect browser network activity for any backend request. Use only the bundled public sample.
4. Check mobile layout, accessible navigation, and the large demo bundle's load time on a constrained connection. Resolve observed issues before public release.
5. Review exact metric-to-training-run evidence and the remaining image provenance/permission note before publication. The owner then decides whether to make production public and whether to use a custom domain.

## Release and rollback gates

- **Owner gate:** Confirm Hobby eligibility and current terms, create/link the Vercel project, choose the Git production branch, enable preview protection, and review any privacy/logging settings. No billing upgrade or DNS change is implicit.
- **Evidence gate:** Preview build, route/network checks, sample/export behavior, research disclaimers, metric provenance, and image rights must be recorded before promotion. Manual checks remain deferred until the owner begins the end-stage validation pass.
- **Production gate:** The owner explicitly approves promotion and public access. A Vercel preview URL alone is not release approval.
- **Rollback:** For an existing production site, [Hobby Instant Rollback](https://vercel.com/docs/instant-rollback) can return to the immediately previous production deployment. The first release has no prior deployment to restore; if it must be withdrawn, the owner can enable All Deployments authentication while investigating. Confirm current controls in the dashboard before using them. A rollback may leave configuration differences; verify the restored routes and assets afterward.

## Open decisions

1. Does the owner confirm the intended public use qualifies as personal and noncommercial under current Hobby terms?
2. Which reviewed commit and production branch should be connected, and should auto-assignment of the production domain be disabled until end-stage validation?
3. Is Vercel the selected static host after preview evidence, or should another free host be compared? No provider has been approved for production yet.
