---
trigger: always_on
---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

# Project Guidelines
**IMPORTANT**: These guidelines apply to ALL NEW CODE only. Do NOT refactor or modify existing old code unless explicitly requested. This ensures gradual modernization while maintaining stability.

# Coding Guidelines 
- We Use Angular 21
- Always add documentation when creating new functions (Multi line) and variables (Single line)
- Use DRY principle at project and component level

## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Access Modifiers & Encapsulation
- **Public**: Use only for properties/methods that must be accessed by external components or services.
- **Protected**: Use as the **default** for properties and methods accessed by the HTML template. This keeps the component's public API clean while allowing template access.
- **Private**: Use for internal logic, helper methods, or state management that is never accessed by the template or external classes. 
- **Readonly**: Always use `readonly` for properties that are not reassigned after initialization (especially injected services).
- **Hard Privacy**: Use native JS `#private` syntax only when runtime privacy is strictly required; otherwise, prefer TypeScript's `private`.

## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements
- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates
- Keep templates simple and avoid complex logic.
- **Modern Control Flow:** Strictly use `@if`, `@for`, and `@switch` instead of legacy `*ngIf`, `*ngFor`, or `*ngSwitch`.
  - **@if:** Supports `@else if` and `@else`. Use `as` for variable aliasing (e.g., `@if (obs$ | async; as data)`).
  - **@for:** - A `track` expression is **mandatory** (e.g., `track item.id`). Use `$index` only for static collections.
    - Always provide an `@empty` block if a fallback UI is needed for empty collections.
    - Use contextual variables (`$index`, `$first`, `$last`, `$even`, `$odd`, `$count`) and alias them with `let` if nesting.
  - **@switch:** Uses triple-equals (`===`) comparison. No fallthrough (no `break` needed). Supports multiple `@case` labels for one block and an optional `@default`.
- Use the async pipe to handle observables.
- Do not assume globals like (`new Date()`) are available in templates.
- Do not write arrow functions in templates.

## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function; define as `private readonly` (e.g., `private readonly http = inject(HttpClient);`)