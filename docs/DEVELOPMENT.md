# Development

Commands below run from the repository root. The preparation baseline used Node **22.22.1** and npm **10.9.4**. [.nvmrc](../.nvmrc) currently selects `lts/*`; the README's former Node 14+ advice was stale for the Angular 21 dependencies. See [verification](VERIFICATION.md) for exact outcomes rather than assuming every existing script works.

## Setup and local checks

```sh
npm install --ignore-scripts --no-audit --no-fund
npm run check:ai
npm run check:types
npm run build
npx playwright install chromium
npm run check:browser
```

The install command was verified for web analysis with lifecycle scripts disabled; it does not prepare Electron binaries or Git hooks. [.npmrc](../.npmrc) enables legacy peer resolution. No lockfile is tracked, so dependency resolution can differ between runs. Do not use `npm ci` until the team adopts a lockfile. A normal `npm install` also runs Husky's `prepare` hook; desktop installation remains a separate validation task.

`npm run check:browser` starts its own localhost server from built files, intercepts every external request, and stores its screenshot and results in `dist/browser-checks`. Its API responses are fixtures.

`npm run check:ai` runs the documentation checker and focused Node regression tests. It does not replace Angular integration, browser, or accounting journey checks. `npm test` currently has no Angular test target; `npm run lint` currently fails because Nx is absent. Keep these gaps visible instead of reporting an all-green application.

## Environment and preview

[build-env.js](../scripts/build-env.js) generates the ignored `apps/web-giddh/src/environments/environment.generated.ts`. Local mode reads `.env.local`; production/CI mode takes process environment values; Electron mode reads `.env.electron`. [inject-env-vars.js](../scripts/inject-env-vars.js) separately reads `.env` for local HTML injection. These are distinct paths; supplying only one file does not configure both. Use the variable names in [.env.example](../.env.example) and [.env.template](../.env.template), with values supplied through the team's approved channel.

URL controls include `APP_URL`, `API_URL`, `UK_API_URL`, `PORTAL_URL`, and `OFFLINE_API_URL`. OAuth, OTP, and payment names are defined in the generator and examples; do not copy credentials into documentation, commits, or logs. Values emitted into generated JavaScript/HTML are visible to clients, even if their names contain `SECRET`.

Local defaults contact the test primary API but **the UK API default is production**. Configure an approved sandbox before signing in or submitting data. No test account, company, or backend schema is supplied by this repository.

```sh
npm start
```

The web serve target in [angular.json](../angular.json) uses `http://localhost:3000`. Once compilation succeeds, compare login, company/branch selection, report filters, and the changed flow against the baseline. Exercise empty/error responses and allowed/denied permissions. For UI changes, follow [design verification](DESIGN.md). The local build and fixture login checks pass; see [verification](VERIFICATION.md) for remaining gaps.

## Release and recovery

The existing [contribution flow](../README.md#contributing-guide) starts normal feature branches from `beta-stage`, preserves a single stage source branch, and prohibits resolving conflicts directly on GitHub. This preparation explicitly targets the user's requested `giddh-2.0` branch; it does not rewrite that general workflow.

Observed executable mappings in the root [buildspec](../buildspec.yml) are `giddh-2.0` → `build-test`, `86d0fexwc-test` → `build-stage`, and `books-production` → `build-prod`. The [app buildspec](../apps/web-giddh/buildspec.yml) has additional overrides. These differ from README branch names; confirm the active pipeline before release. Builds create `dist/apps/web-giddh`; running a build does not authorize publishing it.

Desktop releases use the [macOS workflow](../.github/workflows/macos-release.yml), [Windows workflow](../.github/workflows/windows-release.yml), and [Electron signing guide](../electron-sign/README.md). The [branch/environment notes](README-ELECTRON-BRANCH-ENV.md) contain historical commands missing from current package scripts; verify against the workflows before using them. Signing, uploading, promotion, and rollback authority remain with release owners.

Keep changes in small commits. To undo a refactor, revert its commit on a working branch and rerun the affected checks; do not reset, clean, or stash someone else's work. A deployed rollback must use the release owner's approved previous artifact and account for persisted data/API compatibility. No production rollback procedure has been exercised here.

The existing Husky pre-commit hook runs `lint-staged`; post-commit runs `code-review-graph update`. Those tools are not fully declared by package.json, so hooks need their team-managed tooling. The [application regression CI check](../.github/workflows/ai-foundation.yml) is a separate, repeatable verification path with no deployment step.
