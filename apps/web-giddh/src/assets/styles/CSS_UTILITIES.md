# Giddh CSS utilities & theme catalog (complete)

**Purpose:** Before writing component SCSS or inventing classes, look up existing utilities here.

**Last rebuilt from:**
- `abstracts/_mixins.scss` (via `utilities/_text.scss` includes)
- `utilities/_other.scss`
- `utilities/_responsive.scss`
- `base/_typography.scss`
- `themes/_theme-base-classes.scss`
- `pages/_dialog.scss`
- `vendors/_boostrap.css` (Bootstrap 4 subset)

**Rule:** Prefer existing classes. Put **feature-only** styles (one dialog’s chips/progress, fixed control widths) in the **component `.scss`**, not `_other.scss`.

---

## 1. Theme CSS variables & classes

**Source:** `themes/_theme-base-classes.scss` (on `body`)

### Semantic aliases
| Variable | Resolves to |
|----------|-------------|
| `--text-primary-color` | `var(--theme-primary-color)` |
| `--bg-primary-color` | `var(--theme-primary-color)` |
| `--border-color` | `var(--color-silver)` |
| `--lighter-percent` | `10%` (default-theme) / `20%` (dark-theme) |
| `--theme-primary-light` | `color-mix` of primary + white |
| `--theme-accent-light` | `color-mix` of accent + white |
| `--theme-warn-light` | `color-mix` of warn + white |

### Color tokens (default + dark themes)
| Variable | Notes |
|----------|-------|
| `--color-black` | `#0d0d0d` |
| `--color-dark-black` | `#212529` |
| `--color-white` | `#ffffff` |
| `--color-transparent` | `transparent` |
| `--color-light-gray` | `#f5f5f5` |
| `--color-medium-gray` | `#9b9b9e` |
| `--color-dark-gray` | `#505159` (dark theme: equals light-gray) |
| `--color-silver` | `#cbcfd2` |
| `--color-border-medium` | `#dee2e6` |
| `--color-border-light` | `#e7e9eb9a` |
| `--color-fields-border` | `#0000001f` |
| `--color-orange` | `#e58a00` |
| `--color-deep-orange` | `#ff9933` |
| `--color-brown-gold` | `#996515` |
| `--color-red` | `#c51e3a` |
| `--color-blue` | `#2196f3` |
| `--color-green` | `#098757` |
| `--color-danger-light` | `#e545561a` |
| `--color-orange-light` | `#e58a0026` |
| `--color-warm-orange-light` | `#fff3e0` |
| `--color-red-light` | `#e5455626` |
| `--color-green-light` | `#36b28326` |
| `--color-success-light` | `#e0f3e5` |
| `--color-apple-search-background` | `#575150` |
| `--color-field-hover` | `#000000de` |
| `--color-border-focus` | `#3f51b5` |
| `--color-mat-option` | `#0000000a` |
| `--color-shadow-light` | `#00000033` (dark: white alpha) |
| `--color-drag-bottom-shadow` | `#00000024` (dark: white alpha) |
| `--color-drag-right-shadow` | `#0000001f` (dark: white alpha) |
| `--mat-menu-box-shadow` | Material menu shadow stack |
| `--table-background-color` | `#ffffff` / dark `#424242` |
| `--filter-image-color-white` | image filter |
| `--color-image-filter-quaternary` | icon filter (differs in dark) |
| `--url-caret-image` | caret SVG url (theme-specific) |

### Theme helper classes
| Class | Effect |
|-------|--------|
| `.theme-primary-light` | `background-color: var(--theme-primary-light)` |
| `.theme-accent-light` | `background-color: var(--theme-accent-light)` |
| `.theme-warn-light` | `background-color: var(--theme-warn-light)` |
| `.mat-app-background` | surface + on-surface colors |
| `.bg-light-gray` | light gray bg (**default-theme only**) |

Also use Material/theme vars when present: `--theme-primary-color`, `--theme-accent-color`, `--theme-warn-color`, `--theme-background-color`, `--theme-foreground-color`, `--header-height`, `--custom-mat-form-field-height`.

---

## 2. Typography utilities

**Source:** `base/_typography.scss` (mixin `typography-utilities`)

Also creates CSS vars: `--font-weight-*`, `--font-size-*`, `--line-height-*`, `--letter-spacing-*`.

| Pattern | Classes | Values |
|---------|---------|--------|
| `.font-weight-*` | `regular`, `medium`, `semibold`, `bold` | 400, 500, 600, 700 |
| `.font-size-*` | `9`, `12`, `14`, `15`, `16`, `20`, `24`, `32`, `48` | px |
| `.line-height-*` | `16`, `20`, `22`, `24`, `28`, `32`, `36`, `40`, `56` | px |
| `.letter-spacing-*` | `normal`, `wide`, `wider`, `widest` | 0 / 0.25 / 0.4 / 1.5 px |

Root: `--font-family: 'Inter'`.

**Also in `_other.scss`:** `.lh-0`, `.lh-1`, `.font-style-italic`, `.icon-font-11`, `.icon-font-22`, `.icon-font-48`.

---

## 3. Mixin-generated utilities (`utilities/_text.scss`)

All generated from `abstracts/_mixins.scss`.

### Text transform → `.text-*`
`lowercase`, `uppercase`, `capitalize`, `none`, `unset`, `inherit`

### Text align → `.text-*`
`left`, `right`, `center`, `justify`, `unset`, `inherit`

> Note: `_other.scss` also defines `.text-capitalize|uppercase|lowercase|transform-none`. Prefer mixin/Bootstrap equivalents when possible.

### Word wrap → `.word-wrap-*`
`normal`, `break-word`, `anywhere`, `unset`, `inherit`

### Word break → `.word-break-*`
`normal`, `break-all`, `keep-all`, `unset`, `inherit`

### White space → `.white-space-*`
`normal`, `nowrap`, `pre`, `pre-wrap`, `pre-line`, `break-spaces`, `unset`, `inherit`

### Cursor → `.cursor-*`
`auto`, `default`, `none`, `pointer`, `help`, `wait`, `text`, `move`, `not-allowed`, `grab`, `grabbing`, `crosshair`, `copy`, `alias`, `progress`, `cell`, `all-scroll`, `col-resize`, `row-resize`, `n-resize`, `e-resize`, `s-resize`, `w-resize`, `ne-resize`, `nw-resize`, `se-resize`, `sw-resize`, `ew-resize`, `ns-resize`, `nesw-resize`, `nwse-resize`, `zoom-in`, `zoom-out`, `unset`, `inherit`

### Opacity → `.opacity-*`
| Suffix | Value |
|--------|-------|
| `0` | 0 |
| `10` | 0.1 |
| `25` | 0.25 |
| `50` | 0.5 |
| `75` | 0.75 |
| `90` | 0.9 |
| `100` | 1 |
| `unset` / `inherit` | as named |

### User select → `.user-select-*`
`none`, `auto`, `text`, `contain`, `all`, `unset`, `inherit`

### Position → `.position-*`
`static`, `relative`, `absolute`, `fixed`, `sticky`, `unset`, `inherit`

### Inset / offsets
| Pattern | Suffixes | Unit |
|---------|----------|------|
| `.top-*` `.right-*` `.bottom-*` `.left-*` | `0`, `4`, `8`, `16` | px |
| same | `unset`, `inherit` | keyword |
| `.inset-0` | — | `inset: 0` |
| `.inset-unset` | — | `inset: unset` |

> `_other.scss` also has plain `.top-0` `.left-0` `.right-0` `.bottom-0` `.inset-0` (without `!important`). Prefer mixin classes when override is needed.

### Width → `.w-*` (%)
`auto`, `unset`, `inherit`, `fit-content`, `0`, `25` (25%), `50`, `75`, `100`

### Height → `.h-*` (%)
`auto`, `unset`, `inherit`, `0`, `25`, `50`, `75`, `100`

### Rotate → `.rotate-*` / `.-rotate-*`
| Class | Deg |
|-------|-----|
| `.rotate-0` … `.rotate-315` | 0, 45, 90, 135, 180, 225, 270, 315 |
| `.rotate-unset` `.rotate-inherit` | keywords |
| `.-rotate-45` `.-rotate-90` `.-rotate-135` `.-rotate-180` | negative |

### Scale → `.scale-*`
| Suffix | Scale |
|--------|-------|
| `0` `25` `50` `75` `100` `110` `125` `150` `200` | 0 … 2 |
| `unset` `inherit` | keywords |

### Text decoration → `.text-decoration-*`
`none`, `underline`, `overline`, `line-through`, `unset`, `inherit`

### Border radius → `.border-radius-*`
| Suffix | Value / CSS var |
|--------|-----------------|
| `0` | 0px → `--mat-border-radius-0` |
| `circle` | 100% |
| `4` `8` `12` `16` | px |
| `unset` `inherit` | keywords |

### Z-index → `.z-index-*`
`n1` (-1), `0`, `1`, `2`, `3`, `4`, `5`, `9`, `10`, `99`, `999`, `1000`, `auto`, `unset`, `inherit`  
(also CSS vars `--z-index-*`)

### Overflow → `.overflow-*` / `.overflow-x-*` / `.overflow-y-*`
`hidden`, `visible`, `auto`, `scroll`, `clip`, `unset`, `inherit`

### Absolute center helpers
| Class | Effect |
|-------|--------|
| `.absolute-center-vertical` | absolute + top 50% + translateY(-50%) |
| `.absolute-center-horizontal` | absolute + left 50% + translateX(-50%) |
| `.absolute-center` | absolute + 50%/50% + translate(-50%,-50%) |

### Visibility → `.visibility-*`
`visible`, `hidden`, `collapse`, `unset`, `inherit`

### Pointer events → `.pointer-events-*`
`auto`, `none`, `visible`, `painted`, `fill`, `stroke`, `all`, `unset`, `inherit`

> `_other.scss` also has misspelled `.pointer-event-none` / `.pointer-event-all` — prefer `.pointer-events-*`.

### Min / max height & width (px steps)

| Pattern | Numeric suffixes | Also |
|---------|------------------|------|
| `.min-h-*` | 0, 50…500 (step 50) | `auto`, `unset`, `inherit` |
| `.max-h-*` | 0, 50…500, then 600…1000 (step 100) | `auto`, `none`, `unset`, `inherit` |
| `.min-w-*` | 0, 50…500, 600…1000 | `auto`, `unset`, `inherit` |
| `.max-w-*` | same as min-w | + `none` |

Examples: `.min-h-100`, `.max-h-500`, `.min-w-200`, `.max-w-1000`.

---

## 4. Hand-written utilities (`utilities/_other.scss`)

### Borders
| Class | Effect |
|-------|--------|
| `.border` | 1px solid `var(--border-color)` |
| `.border-dashed` | `border-style: dashed` |
| `.border-top` `.border-bottom` `.border-left` `.border-right` | 1px side border |
| `.border-none` | no border |
| `.border-top-none` `.border-bottom-none` `.border-left-none` `.border-right-none` | clear side |
| `.border-color-transparent` | transparent border color |
| `.border-color-primary` | `var(--text-primary-color)` |

### Partial radius (4px corners)
`.only-left-radius` `.only-right-radius` `.only-top-radius` `.only-bottom-radius`

### Text color
| Class | Color |
|-------|-------|
| `.text-primary` | `--text-primary-color` |
| `.text-light` | `--color-medium-gray` |
| `.text-white` `.text-black` | white / black |
| `.text-green` `.text-orange` `.text-red` `.text-blue` | status |
| `.text-saffron` | `--color-deep-orange` |
| `.text-color-inherit` | inherit |
| `.light-gray` | `--color-dark-gray` (text) |

### Backgrounds
| Class | Notes |
|-------|-------|
| `.bg-white` `.bg-black` `.bg-transparent` | |
| `.bg-warning` | `--color-warm-orange-light` |
| `.bg-table-background-color` | |
| `.bg-grey` | light-gray (default) / primary-light (dark) |
| `.sky-blue-bg` `.custom-keyboard-dropdown-list-focus` | `--theme-primary-light` |
| `.dark-grey-bg` | `--color-dark-gray` |

### Status dots
`.dot-warning` `.dot-primary` `.dot-success`

### Text overflow / wrap helpers
`.text-limit` (1-line clamp), `.nowrap`, `.text-ellipsis`, `.word-wrap` (break-word), `.text-wrap`

### Underline / transform (also see mixin section)
`.text-underline` `.underline`  
`.text-capitalize` `.text-uppercase` `.text-lowercase` `.text-transform-none`

### Spacing extras (non-Bootstrap)
`.pt-custom-85` `.mt-custom-100` `.mb-custom-80` `.mb-custom-100`

### Fixed pixel widths / heights
| Class | Size |
|-------|------|
| `.width-60` | 60px |
| `.width-100` `.w100` | 100px |
| `.w120` | 120px |
| `.w125` | 125px |
| `.width-150` | 150px (+ min-width) |
| `.w200` | 200px |
| `.min-width-unset` `.min-width-0` `.min-width-100` `.min-width-160` | |
| `.max-width-50` `100` `150` `250` `350` `500` | |
| `.min-height-100` | 100px |
| `.max-height-65vh` | 65vh |
| `.full-viewport-height` | `100vh - var(--header-height)` |
| `.custom-mat-form-field-height` | form field height token |

> Prefer mixin `.w-100` (100% width) vs `.width-100` / `.w100` (100**px**). Names collide easily.

### Grid / gaps
| Class | Value |
|-------|-------|
| `.d-grid` `.d-inline-grid` | display |
| `.grid-column-3` | `repeat(3, 1fr)` |
| `.grid-child-column-full` | `grid-column: 1 / -1` |
| `.column-gap-05` | 5px |
| `.column-gap-1` | 10px |
| `.column-gap-15` | 15px |
| `.column-gap-2` | 20px |
| `.column-gap-3` | 30px |
| `.column-gap-4` | 40px |
| `.column-gap-5` | 50px |
| `.row-gap-*` | same steps as column-gap |

### Float / clear / align
`.float-left` `.float-right` `.float-none` `.clear-both`  
`.vertical-align-middle` `.vertical-align-top` `.vertical-align-bottom`  
`.align-items-baseline`

### Shadow / table / misc
`.box-shadow` (menu shadow) `.box-shadow-none`  
`.table-layout-auto` `.table-layout-fixed`  
`.table-border-collapse` `.table-border-separate`  
`.pointer-event-none` `.pointer-event-all`  
`.hover-trigger` + child `.hover-target` (show on hover/focus)  
`.dropdown-bg` + `.arrow-dropdown` (legacy caret UI)

### `[hidden]` override
`[hidden]` and `[hidden].d-flex|d-block|d-inline|d-inline-block|d-inline-flex` → `display: none !important`

---

## 5. Responsive display helpers

**Source:** `utilities/_responsive.scss`

Breakpoints (exact): `tablet`, `small-desktop`, `medium-desktop`, `large-desktop`, `xl-desktop`

Patterns include:
- `.d-{breakpoint}-none` / `.d-{breakpoint}-block`
- plus other spacing helpers in that file (open `_responsive.scss` when needed)

---

## 6. Dialog shell classes

**Source:** `pages/_dialog.scss`

| Class | Use |
|-------|-----|
| `.aside-dialog-wrapper` | full-viewport aside shell |
| `.dialog-header` | primary header bar |
| `.dialog-body` | content area (`calc(100% - 60px)`) |
| `.dialog-body.max-height-80vh` | optional max height |
| `.aside-dialog-overflow` | scrollable aside content max-height |

---

## 7. Bootstrap 4 utilities (`vendors/_boostrap.css`)

Use freely for layout. Common set:

### Display
`.d-none` `.d-inline` `.d-inline-block` `.d-block` `.d-table` `.d-table-row` `.d-table-cell` `.d-flex` `.d-inline-flex`  
Responsive: `.d-{sm|md|lg|xl}-{none|inline|inline-block|block|table|…|flex|inline-flex}`

### Flex
`.flex-row` `.flex-column` `.flex-row-reverse` `.flex-column-reverse`  
`.flex-wrap` `.flex-nowrap` `.flex-wrap-reverse`  
`.flex-fill` `.flex-grow-0` `.flex-grow-1` `.flex-shrink-0` `.flex-shrink-1`  
`.justify-content-start|end|center|between|around`  
`.align-items-start|end|center|baseline|stretch`  
`.align-content-start|end|center|between|around|stretch`  
`.align-self-auto|start|end|center|baseline|stretch`  
`.order-0` … `.order-12` `.order-first` `.order-last`

### Spacing scale (`0`–`5`)
`0` = 0, `1` = .25rem, `2` = .5rem, `3` = 1rem, `4` = 1.5rem, `5` = 3rem

| Pattern | Meaning |
|---------|---------|
| `.m-*` `.mt-*` `.mb-*` `.ml-*` `.mr-*` `.mx-*` `.my-*` | margin |
| `.p-*` `.pt-*` `.pb-*` `.pl-*` `.pr-*` `.px-*` `.py-*` | padding |
| `.m-auto` `.mx-auto` etc. | auto margins |

### Sizing / text / float (Bootstrap)
`.w-25` `.w-50` `.w-75` `.w-100` `.w-auto`  
`.h-25` `.h-50` `.h-75` `.h-100` `.h-auto`  
`.mw-100` `.mh-100`  
`.text-left` `.text-right` `.text-center` `.text-justify`  
`.text-lowercase` `.text-uppercase` `.text-capitalize`  
`.font-weight-bold` `.font-weight-normal` `.font-weight-light` `.font-italic`  
`.text-white` `.text-muted` (Bootstrap palette — prefer Giddh theme text classes for brand colors)  
`.float-left` `.float-right` `.float-none`  
`.shadow` `.shadow-sm` `.shadow-lg` `.shadow-none` (if present in vendor file)

### Grid
`.container` `.container-fluid` `.row`  
`.col` `.col-auto` `.col-1` … `.col-12`  
`.col-{sm|md|lg|xl}-*` same pattern  
`.offset-*` / responsive offsets

---

## 8. Naming collisions (read carefully)

| Need | Prefer | Avoid confusing with |
|------|--------|----------------------|
| Width **100%** | `.w-100` (mixin/Bootstrap) | `.width-100` / `.w100` = **100px** (`_other`) |
| Min-width **0** | `.min-width-0` (`_other`) or `.min-w-0` (mixin) | |
| Max-width **150px** | `.max-w-150` (mixin) or `.max-width-150` (`_other`) | either OK |
| Pointer none | `.pointer-events-none` (mixin) | `.pointer-event-none` (`_other`, misspelled) |
| Primary text | `.text-primary` (Giddh → theme primary) | Bootstrap “primary” palette if any |
| Soft primary bg | `.theme-primary-light` | `.sky-blue-bg` (same var, older name) |

---

## 9. When NOT to add global utilities

Do **not** put into `_other.scss` unless reused across many features:
- Status chips for one component
- Soft alert panels / progress tracks for one dialog
- One-off fixed widths for a single form control
- Fancy multi-column grids unique to one screen (`grid-template-columns: …`)

Keep those in the component `.scss`.

---

## 10. Quick lookup examples

```html
<!-- flex row with gaps -->
<div class="d-flex align-items-center column-gap-1 row-gap-05">

<!-- selected card -->
<div class="border border-radius-8 p-2"
     [class.theme-primary-light]="selected"
     [class.border-color-primary]="selected">

<!-- typography -->
<span class="font-size-12 font-weight-semibold text-primary">

<!-- aside dialog -->
<div class="aside-dialog-wrapper">
  <div class="dialog-header">…</div>
  <div class="dialog-body">…</div>
</div>
```
