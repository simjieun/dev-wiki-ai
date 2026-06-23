# Next.js Docs Design Guidance

## Context and Goals

Next.js Docs must present developer documentation with a clean, functional, implementation-oriented interface that helps technical users scan, navigate, and act quickly.

This document is the implementation reference for DevWiki AI UI work when matching the Next.js Docs style. Teams must prefer system consistency over local visual exceptions.

Known page component density must inform design decisions:

- Links: 981
- Cards: 108
- Lists: 98
- Buttons: 48
- Inputs: 6
- Navigation: 6

## Design Tokens and Foundations

### Font Tokens

Implementations must use semantic font tokens instead of one-off font values.

| Token | Value |
| --- | --- |
| `font.family.primary` | `Geist` |
| `font.family.stack` | `Geist, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol` |
| `font.size.base` | `14px` |
| `font.weight.base` | `400` |
| `font.lineHeight.base` | `20px` |
| `font.size.xs` | `12px` |
| `font.size.sm` | `14px` |
| `font.size.md` | `16px` |
| `font.size.lg` | `18px` |
| `font.size.xl` | `20px` |
| `font.size.2xl` | `24px` |
| `font.size.3xl` | `30px` |
| `font.size.4xl` | `36px` |

### Color Tokens

Components must use semantic color tokens, not raw hex or raw OKLCH values.

| Token | Value |
| --- | --- |
| `color.text.primary` | `#4d4d4d` |
| `color.text.secondary` | `#171717` |
| `color.text.tertiary` | `#666666` |
| `color.text.inverse` | `oklch(0.5761 0.2508 258.23)` |
| `color.surface.base` | `#000000` |
| `color.surface.muted` | `#ffffff` |
| `color.border.default` | `#ebebeb` |

### Spacing Tokens

Layouts and components must use the shared spacing scale. Implementations must not introduce one-off spacing values.

| Token | Value |
| --- | --- |
| `space.1` | `4px` |
| `space.2` | `6px` |
| `space.3` | `8px` |
| `space.4` | `16px` |
| `space.5` | `20px` |
| `space.6` | `32px` |
| `space.7` | `40px` |
| `space.8` | `48px` |

### Radius, Shadow, and Motion Tokens

| Token | Value |
| --- | --- |
| `radius.xs` | `2px` |
| `radius.sm` | `6px` |
| `shadow.1` | `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(255, 255, 255) 0px 0px 0px 2px, oklch(0.5761 0.2508 258.23) 0px 0px 0px 4px` |
| `motion.duration.instant` | `150ms` |

### Foundation Rules

- Body text must use `font.family.stack`, `font.size.base`, `font.weight.base`, and `font.lineHeight.base`.
- Text hierarchy must use the typography scale without custom intermediate sizes.
- Content surfaces should remain quiet and documentation-focused.
- Borders must use `color.border.default` unless a component state token defines a stronger state.
- Focus-visible treatment must use `shadow.1` or an equivalent tokenized focus ring with equal or better visibility.
- Motion must be functional and must use `motion.duration.instant` for hover, focus, and press feedback.

## Component-Level Rules

### Links

Links are the highest-density component and must be optimized for scanning.

#### Anatomy

- A link must include descriptive text.
- A link may include a leading or trailing icon when it clarifies destination or external behavior.
- Inline links must preserve surrounding text flow.

#### Variants

- Inline link: used in prose.
- Navigation link: used in sidebars, headers, and table-of-contents regions.
- Card link: used when the entire card is clickable.

#### States

- Default state must use tokenized text color and must be visually distinguishable from body text.
- Hover state must provide a visible text, underline, or background change.
- Focus-visible state must show a visible tokenized focus indicator.
- Active state must indicate current route or current section.
- Disabled state must not be used for navigation destinations; unavailable destinations should be hidden or explained.
- Loading state should be avoided for plain links; when navigation is pending, adjacent route-level loading UI should communicate progress.
- Error state must identify broken or unavailable destinations with clear text near the link.

#### Behavior

- Keyboard users must activate links with `Enter`.
- Pointer users must receive hover feedback within `motion.duration.instant`.
- Touch targets should be at least `44px` high for navigation links.
- Long link text must wrap without clipping, layout shift, or overlap.
- Empty link labels must fail implementation review.

### Buttons

Buttons must trigger actions, not navigation.

#### Anatomy

- A button must include a descriptive label or an accessible name.
- Icon-only buttons must include an accessible label and visible focus state.
- Buttons may include a leading icon when it improves action recognition.

#### Variants

- Primary button: main page action.
- Secondary button: supporting action.
- Ghost button: low-emphasis repeated or toolbar action.
- Destructive button: irreversible or high-risk action.

#### States

- Default state must clearly indicate clickability.
- Hover state must change surface, border, or text token.
- Focus-visible state must show `shadow.1` or equivalent tokenized ring.
- Active state must show pressed feedback.
- Disabled state must reduce emphasis and must block pointer and keyboard activation.
- Loading state must keep button dimensions stable and must expose pending status to assistive tech.
- Error state must be paired with nearby explanatory text.

#### Behavior

- Keyboard users must activate buttons with `Enter` and `Space`.
- Pointer and touch users must receive immediate press feedback.
- Loading buttons must not shrink when label text changes.
- Long labels must wrap or truncate according to available layout without obscuring adjacent content.

### Inputs and Textareas

Inputs are low-density but high-importance. They must be predictable, labeled, and resilient to long developer content.

#### Anatomy

- Each input must have a visible label.
- Optional helper text should clarify format or constraints.
- Error text must be placed near the field it describes.

#### Variants

- Text input: short single-line values.
- Textarea: long Markdown or prose content.
- Search input: query-oriented filtering or documentation search.

#### States

- Default state must show field boundary using `color.border.default`.
- Hover state should subtly strengthen the border.
- Focus-visible state must show a tokenized focus ring.
- Active state must preserve focus affordance while editing.
- Disabled state must prevent editing and must visually communicate unavailability.
- Loading state must be used when field suggestions or validation are pending.
- Error state must show clear text and a visible field-level indicator.

#### Behavior

- Keyboard users must tab to fields in logical order.
- Pointer and touch users must be able to place the caret predictably.
- Textareas must support long content with vertical resizing or stable scrolling.
- Tags or comma-separated inputs must trim empty values before submission.
- Empty required fields must block submission with accessible feedback.

### Cards

Cards must group related documentation actions or concepts without becoming decorative containers.

#### Anatomy

- A card must include a title.
- A card should include concise supporting text.
- A card may include metadata or a link target.

#### Variants

- Documentation card: links to a guide or concept.
- Action card: starts a task or workflow.
- Status card: summarizes system or task state.

#### States

- Default state must use tokenized border and surface.
- Hover state must only appear when the card is interactive.
- Focus-visible state must be visible when the card is keyboard-focusable.
- Active state must communicate pressed or selected status.
- Disabled state must be used only when the unavailable state is meaningful and explained.
- Loading state must preserve card dimensions.
- Error state must include recoverable explanation or next action.

#### Behavior

- Interactive cards must expose a single, clear destination or action.
- Keyboard behavior must match the underlying semantic element.
- Long titles must wrap without overlapping metadata.
- Empty cards must show a useful empty state or be removed.

### Lists

Lists must support dense scanning and accurate hierarchy.

#### Anatomy

- A list must use semantic list markup when representing repeated items.
- List items must contain one primary idea or action.
- Nested lists should be limited and purposeful.

#### States

- Default state must use base typography and spacing tokens.
- Hover state must be used only for interactive list items.
- Focus-visible state must be visible on interactive list items.
- Active state must identify selected or current items.
- Disabled state must include explanation when the item remains visible.
- Loading state must preserve item rhythm.
- Error state must identify which item or list failed.

#### Behavior

- Keyboard users must reach interactive list items in document order.
- Pointer and touch targets should remain large enough for repeated use.
- Long items must wrap and maintain alignment.
- Empty lists must explain that there is no content yet.

### Navigation

Navigation must prioritize orientation, current location, and fast movement through documentation.

#### Anatomy

- Navigation must include a clear landmark or semantic `nav`.
- Current page or section must be visually and programmatically identifiable.
- Navigation groups should use concise labels.

#### States

- Default state must be readable at documentation density.
- Hover state must make targets feel interactive.
- Focus-visible state must be highly visible and not clipped.
- Active state must identify current route or section.
- Disabled state should be avoided.
- Loading state should appear at route or page level, not on every nav item.
- Error state must identify unavailable navigation data.

#### Behavior

- Keyboard users must be able to tab through navigation in logical order.
- Pointer users must receive hover feedback.
- Touch users must have stable targets with no accidental overlap.
- Long navigation labels must wrap or truncate with accessible full labels.
- Navigation must remain usable at mobile and desktop widths.

## Accessibility Requirements and Testable Acceptance Criteria

The target is WCAG 2.2 AA. Accessibility rules must be testable in implementation.

### Required Checks

- Every interactive element must be reachable by keyboard.
- Every interactive element must have a visible focus-visible state.
- Every button and icon-only control must have an accessible name.
- Every form field must have a visible label.
- Required fields must expose required state through native attributes or accessible text.
- Error messages must be programmatically associated with the relevant field when possible.
- Text and interactive state contrast must meet WCAG 2.2 AA.
- Focus indicators must not be hidden by overflow clipping.
- Disabled controls must not be focusable unless there is a documented accessibility reason.
- Loading states must communicate progress without layout shift.

### Pass/Fail Examples

- Pass: Tabbing through the page reaches navigation, inputs, buttons, and content actions in a logical order.
- Fail: A custom clickable `div` cannot be activated with keyboard.
- Pass: A focused input shows a visible tokenized ring and retains its label.
- Fail: Focus state is only a color shift with insufficient contrast.
- Pass: A failed form submission displays field-level errors near each invalid input.
- Fail: Error feedback appears only as color or a toast that disappears before it can be read.

## Content and Tone Standards

Writing must be concise, confident, and implementation-focused.

### Labels

- Labels must describe the exact action or destination.
- Labels should use verbs for actions and nouns for destinations.
- Ambiguous labels such as "Click here", "Submit", or "More" must not be used without context.

### Examples

| Weak | Better |
| --- | --- |
| `Submit` | `Save Document` |
| `More` | `View API Reference` |
| `Error` | `Document title is required.` |
| `Loading` | `Saving document...` |

### Helper Text

- Helper text should clarify format, constraints, or consequences.
- Helper text must not repeat the label.
- Error text must state what happened and how to fix it.

## Anti-Patterns and Prohibited Implementations

- Components must not use raw hex values directly in implementation guidance.
- Components must not introduce one-off spacing, typography, or radius values.
- Interactive elements must not hide focus indicators.
- Low-contrast text must not ship.
- Clickable non-semantic elements must not replace native links or buttons.
- Buttons must not be used for navigation when a link is semantically correct.
- Links must not trigger mutations.
- Loading states must not cause layout jump.
- Error states must not rely on color alone.
- Empty states must not leave blank regions without explanation.
- Documentation pages must not use decorative UI that reduces scan speed.

## Migration Notes and Edge-Case Handling

- Existing one-off styles should be mapped to the nearest semantic token before adding new tokens.
- New tokens should be introduced only when multiple components need the same semantic behavior.
- Long developer content must be expected in titles, code labels, paths, URLs, and textareas.
- Components should be tested with empty, short, long, and localized content.
- Dense pages should optimize for scanning before visual flourish.
- API-driven components must define loading, empty, and error states before implementation is considered complete.

## QA Checklist

- [ ] The implementation uses semantic tokens instead of raw visual values.
- [ ] Typography uses the defined scale and base font stack.
- [ ] Spacing uses only the shared spacing scale.
- [ ] Every interactive component has default, hover, focus-visible, active, disabled, loading, and error state rules.
- [ ] Keyboard interaction works for all interactive elements.
- [ ] Pointer and touch interactions have clear feedback.
- [ ] Focus-visible indicators are visible and not clipped.
- [ ] Contrast meets WCAG 2.2 AA.
- [ ] Form fields have visible labels and accessible errors.
- [ ] Long content wraps, truncates, or scrolls without overlap.
- [ ] Empty states are explicit and useful.
- [ ] Loading states preserve dimensions and communicate progress.
- [ ] Navigation identifies the current route or section.
- [ ] Content labels are specific and action-oriented.
- [ ] No local visual exception exists without a documented token-level reason.
