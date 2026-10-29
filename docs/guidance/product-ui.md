<!-- middleware guidance: product-ui, version 046fbf2131b2. Kept by the middleware: change profiles/product-ui.md there and sync again, not this file. -->

Product UI work: the product must stay coherent for the person in the middle of a task.
- Follow the journey before and after the changed step: navigation, shared components, state, saved preferences, permissions, analytics events, responsiveness, accessibility, loading, empty and error states, and recovery.
- A reported defect in one place usually has siblings: inspect the shared component, its callers and sibling flows; fix the confirmed instances within scope; keep intentional differences and record them.
- Reuse the design system, tokens and existing components. Do not introduce a parallel pattern for one screen.
- Keep business rules and API behaviour shared; UI changes must not fork them.
- Verify in the browser where possible and say what you verified. A working button is not a finished task if the end-to-end outcome still fails.
- For different roles, check what each role sees and can do after the change.
- A/B tests need no backend: when this prompt has an Experiments section, assign the variant in the browser and send exposure and conversion events with its snippet (hash assignment, sendBeacon to the events URL with the publishable key, both read from the site's environment variables, never written in the code), fire-and-forget: the page never waits for the middleware and works the same when it is down. Without that section, report a blocker whose "needed" is "Experiments enabled for this repository in the middleware (allowed origins) and experiment <key> defined", not a missing API.
