# Design map

The existing [Angular/CSS rules](../.cursor/rules/angular-giddh-coding-rules.mdc) and [CSS utility catalog](../apps/web-giddh/src/assets/styles/CSS_UTILITIES.md) are the maintained design guidance. Reuse them; this document points to the implementation rather than defining a second palette or component system.

## Where a visual change belongs

| Concern | Existing home |
| --- | --- |
| Style entry and import order | [main.scss](../apps/web-giddh/src/assets/styles/main.scss) |
| Semantic colors, default/dark themes | [theme base classes](../apps/web-giddh/src/assets/styles/themes/_theme-base-classes.scss), [dynamic tenant theme](../apps/web-giddh/src/app/shared/services/dynamic-theme.service.ts) |
| Inter typography and text utilities | [typography](../apps/web-giddh/src/assets/styles/base/_typography.scss) |
| Responsive mixins and container sizes | [mixins](../apps/web-giddh/src/assets/styles/abstracts/_mixins.scss), [variables](../apps/web-giddh/src/assets/styles/abstracts/_variables.scss), [responsive guide](../apps/web-giddh/src/assets/styles/RESPONSIVE_GUIDE.md) |
| Dialog spacing and Material controls | [dialog styles](../apps/web-giddh/src/assets/styles/pages/_dialog.scss), [Material overrides](../apps/web-giddh/src/assets/styles/material/_material-overrides.scss) |
| Loading / empty results | [page loader](../apps/web-giddh/src/app/shared/giddh-page-loader/giddh-page-loader.component.ts), [no-data](../apps/web-giddh/src/app/shared/no-data/no-data.component.ts) |
| Date entry | [Giddh datepicker](../apps/web-giddh/src/app/theme/giddh-datepicker/giddh-datepicker.component.ts) |
| Localized text | [translate directive](../apps/web-giddh/src/app/theme/translate/translate.directive.ts), [locale service](../apps/web-giddh/src/app/services/locale.service.ts) |

Use existing utilities before adding SCSS. Keep feature styles beside the component. For example, `.w-100` means 100%, while `.width-100` / `.w100` mean 100px; confusing them changes a form's layout. Preserve white-label branding through the [existing service](../apps/web-giddh/src/app/services/white-label.service.ts).

The responsive guide describes a tablet-first accounting workspace from 768px upward. It does not establish supported phone layouts. Check the actual component and mixins at tablet and desktop widths; avoid introducing a different breakpoint system.

## Interaction, accessibility, and messaging

Reuse the surrounding feature's loading, empty-result, validation, toast, and dialog patterns. A failed request must not look like an empty successful report. Keep localized messages in their existing translation flow and preserve keyboard focus after dialogs close.

The existing coding rules require WCAG 2.2 AA and AXE checks for UI changes, including keyboard access, visible focus, semantics, contrast, and appropriate ARIA. This is a requirement, not a claim that the current application has passed an accessibility audit. Runtime and visual evidence for this change is recorded in [verification](VERIFICATION.md).

## Existing SEO behavior

This repository is the accounting app, with environment-specific HTML entries configured by [angular.json](../angular.json). [Test](../apps/web-giddh/src/index.test.html) and [stage](../apps/web-giddh/src/index.stage.html) entries contain `noindex, nofollow`; [robots.txt](../apps/web-giddh/src/meta/robots.txt) disallows crawling. Preserve these and the existing titles/descriptions during refactors. Do not infer the marketing website's SEO policy from this app.
