# Preparation verification

Baseline: `giddh-2.0` commit `970543b`, inspected 2026-10-23 in an isolated clean checkout. No pre-existing user changes were present. Node 22.22.1, npm 10.9.4; fresh resolution installed Angular core 21.2.25, CLI 21.2.28, and TypeScript 5.9.3. No lockfile is tracked, so these observations describe this install, not all future installs.

## Checks and coverage

| Check | Observed result |
| --- | --- |
| `npm install --ignore-scripts --no-audit --no-fund` | Passed; lifecycle scripts and desktop binaries were not exercised. |
| `node scripts/build-env.js local` | Generated local environment without credentials; warned that `.env.local` was absent. |
| `node node_modules/typescript/bin/tsc --noEmit -p apps/web-giddh/tsconfig.app.json` | Passed after environment generation. Running it before generation reports missing generated-module imports. |
| `npm run build` | Baseline fails with 124 export-not-found errors, including Angular `SimpleChanges`/`ModuleWithProviders`, NgRx `Action`, and application interfaces; also warns about qz-tray's missing `lna`. |
| `npm test` | Baseline fails: “Cannot determine project or target for command.” No Angular test target is configured. |
| `npm run lint` | Baseline fails: `node_modules/.bin/nx` is absent. |
| Select-all regression tests | 11 behavioral cases passed on original and extracted logic: mutation/copy, clone semantics, nesting/order, duplicate leaf names, ignored array contents, metadata reset, primitive inputs, own properties, and read-only failure. |
| Documentation checker tests | Valid links accepted; missing documents/files/headings and template residue rejected. |

## What changed and what was removed

[selected-all.ts](../apps/web-giddh/src/app/shared/helpers/selected-all.ts) now owns the sentinel, predicate, and request traversal. [GeneralService](../apps/web-giddh/src/app/services/general.service.ts) keeps its public method and existing environment-selected clone adapter (JSON fallback exercised here); [app.constant.ts](../apps/web-giddh/src/app/app.constant.ts) re-exports the existing names. The former private recursive method was moved, not dropped as unused functionality. Its only caller was the public wrapper; callers still use that wrapper or the preserved constants.

No feature, dependency, asset, route, or public entry point was removed. No UI, permission, persistence, analytics, or SEO implementation was changed. No performance gain is claimed. The new [Node tests](../scripts/tests/selected-all.test.cjs) exercise request transformation with the actual service method and clone adapter, without Angular bootstrapping; they inject the helper bindings and do not verify real imports, dependency injection, or browser rendering. TypeScript checking separately checks source imports and re-exports.

## Remaining verification limits

Login, company/branch switching, voucher saving, and DSC signing were traced through source in [flows](FLOWS.md). The baseline build failure prevents a working local screen comparison, browser console assessment, AXE run, or authenticated end-to-end check. No live credentials or safe test company were supplied, and Electron signing/native-host journeys were not run. Passing the focused checks cannot guarantee zero bugs.

The local checker validates the maintained map's simple inline relative links, Markdown headings, and scaffold residue. It does not crawl external URLs, validate code symbols, or establish factual truth. Existing application checks remain visible and unchanged. [Development](DEVELOPMENT.md) gives repeatable commands and recovery instructions.

## Final comparison and fresh-agent handoff

After the extraction, `npm run check:ai` passes all 13 tests and all 11 maintained documents. The full TypeScript check passes. The build still reports the same 124 normalized error diagnostics: zero new and zero resolved. No existing failing check was suppressed or redefined.

A fresh agent read only AGENTS and docs, located the vision, traced voucher saving and permissions, placed the select-all change, identified storage ownership and verification limits, and correctly applied the experiment limit. It then independently ran the focused checks and TypeScript check successfully. Its navigation feedback led to a concrete payload example and corrections in the legacy DSC/Electron guides.

The root AGENTS entry was used in that handoff. Cursor and Claude adapters point to it; their file wiring was inspected, but separate Cursor/Claude application sessions were not launched.
