---
target: DiscountsPage.svelte
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 1
timestamp: 2026-07-25T07-36-04Z
slug: src-lib-components-discountspage-svelte
---
Method: dual-agent (A: ses_067d34e9affevojM7rN8nY2aAv · B: ses_067d33bccffeY7SyO71YTailNQ)

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 3 | ResultsCard updates reactively, toasts confirm actions. No loading indicator for localStorage writes; `confirm()` dialog for "Limpiar" is browser default. |
| 2 | Match System / Real World | 3 | Domain vocabulary (IGV, S/, "Precio Objetivo"). Emoji icons reinforce meaning. "Dscto. Real" vs "Dscto. Requerido" terminology is jargon-heavy; "Efectivo" in ResultsCard reads as "cash" not "effective". |
| 3 | User Control and Freedom | 2 | "Limpiar" with `confirm()` is destructive but lacks undo. Target price mode vs discount mode is mutually exclusive with no graceful transition — entering a target price silently hides all discount rows. |
| 4 | Consistency and Standards | 3 | Consistent glass-card pattern, color semantics (green=savings, purple=target, blue=IGV). Button styles diverge — ActionButtons use gradient backgrounds, ObservationModal uses different gradients. `:global()` overrides fight PriceInput's own styles. |
| 5 | Error Prevention | 2 | DiscountRow caps at 100%. `handleTargetInput` strips non-numeric. No validation that target price is < original price until reactive calculation runs. Target input accepts multiple dots. `confirm()` for clear is the only destructive-action guard. |
| 6 | Recognition Rather Than Recall | 3 | ResultsCard always visible with 4-tile summary. Discount count shown `(N/8)`. History modal with search. Mutual-exclusivity between "target price mode" and "discount mode" is invisible — user must discover that entering a target hides discounts. |
| 7 | Flexibility and Efficiency | n/a | Appropriate for tool mode — single-purpose calculator, not a complex authoring tool. |
| 8 | Aesthetic and Minimalist Design | 2 | 6 distinct visual sections stacked vertically. IGV modal duplicates calculator functionality already on main page. "target-mode-indicator" adds a 7th visual block when active. Visual noise: multiple gradient backgrounds, pulsing animations, dashed borders, box-shadows compete for attention. |
| 9 | Error Recovery | 2 | No tooltip explaining sequential vs stacked discounts. No inline help for why IGV is added/removed. IGV FAB's 🧮 icon ambiguous without context. "Modo Precio Objetivo" hint doesn't explain how it differs from manual discounts. |
| 10 | Help and Documentation | n/a | Not applicable for a utility tool that users should learn by doing. Empty states serve as implicit guidance. |
| **Total** | | **21/32** | **Good (65.6%)** |

---

## Design Specificity Verdict

**Highly Product-Specific.** The UI is tightly coupled to the Peruvian IGV/discount-calculation domain — currency prefix `S/`, IGV at 18%, WhatsApp sharing as the primary distribution channel, "target price" mode, consecutive discount stacking, client-code/observation metadata, and localStorage-backed history. This is not a generic calculator; it's purpose-built for a sales-negotiation workflow in Peru. An unrelated product could not reuse this unchanged.

**Deterministic scan:** The bundled detector returned **0 findings** for `DiscountsPage.svelte`. The detector focuses on code-level issues (a11y, performance, patterns) rather than design-specific concerns, so the lack of findings is expected — the design issues identified by the LLM review are not the type the detector catches.

**Visual overlays:** No browser automation was available for injection. The UI renders cleanly with no console errors.

---

## Overall Impression

The core utility works well — the discount calculation logic is sound, the WhatsApp share formatting is professional, and the dual-mode (stacked discounts vs target price) is a genuine insight for the use case. However, the visual execution is over-engineered: 6+ stacked glass-card sections, a pulsing IGV FAB, gradient overload, and a destructive mode switch that silently hides user data. The biggest opportunity is simplifying the layout and clarifying the mode-switching behavior.

---

## What's Working

1. **WhatsApp share formatting** (lines 210-240): Well-structured with clear visual hierarchy, currency formatting, and IGV transparency. This is the product's core value proposition and it's executed well.

2. **Dual-mode calculation**: Offering both "stacked discounts" and "target price → required discount" is a genuine insight for the use case. The `requiredDiscount` reactive calculation (line 73-75) is clean and immediate.

3. **History system**: The search, select, share/copy, and per-item delete in HistoryModal demonstrates real thought about the workflow. Client-code and observation fields make records retrievable.

---

## Priority Issues

### [P0] Target price mode silently destroys discount context
**What:** Entering a target price instantly removes all discount rows from the DOM (line 78, 285). Discounts remain in state but become invisible and uninteractable.
**Why it matters:** A user who enters 5 discounts then accidentally types a target price loses visual access to their work. This is a data-vanishing bug disguised as a feature toggle.
**Fix:** Either show a warning/toast when switching modes, or visually disable (don't remove) the discount section and show a clear explanation.
**Suggested command:** `$impeccable clarify`

### [P1] IGV FAB position and animation create visual noise
**What:** The FAB is positioned at `top: 45%` on mobile (right edge), with a continuous `igvPulse` animation (4s infinite). It overlaps with scrolling content. On desktop it repositions to bottom-right corner.
**Why it matters:** The animation demands attention on every screen render, competing with the primary task. The floating position on mobile can obscure discount rows.
**Fix:** Remove the pulse animation. Use a static position. Consider placing IGV calculator within the main layout rather than as a floating modal trigger.
**Suggested command:** `$impeccable quieter`

### [P2] ObservationModal dual action ambiguity
**What:** The modal has "Guardar" and "Enviar" buttons. "Enviar" triggers share → save (lines 246-248). "Guardar" triggers save only. But the modal also dispatches a `share` event (line 23) which the parent catches to clear state (line 419). The interaction model is opaque.
**Why it matters:** The user can't predict whether data will be saved, shared, or both. This creates anxiety at a high-stakes moment (sharing a deal calculation).
**Fix:** Make the two actions clearly labeled: "Solo Guardar" vs "Guardar y Compartir". Remove the dual-dispatch pattern.
**Suggested command:** `$impeccable clarify`

### [P2] Visual section overload
**What:** 6 distinct visual sections stacked vertically (header-section, discounts-section, ResultsCard, target-section, ActionButtons, IGV FAB). The IGV modal duplicates calculator functionality already on the main page.
**Why it matters:** High cognitive load — the user must scan multiple competing visual blocks to find relevant information. The IGV modal adds a 7th interactive layer.
**Fix:** Consolidate related sections. Consider merging target-price input with the price input area. Remove the IGV modal and integrate IGV display into ResultsCard.
**Suggested command:** `$impeccable distill`

### [P3] CSS class typo: `.target-inuput` (line 602)
**What:** Dead CSS class defined but never applied (the actual input uses `class="target-input"` on line 330).
**Why it matters:** Code maintenance burden. No user impact.
**Fix:** Remove the dead CSS.
**Suggested command:** `$impeccable polish`

---

## Persona Red Flags

### Pedro the Sales Rep (Primary User)
- Enters 5 discounts for a negotiation, then accidentally types a target price. All discounts disappear from view. He panics, thinks data is lost. He may abandon the tool.
- On mobile, the icon-only action buttons (line 196) make "Guardar" vs "Historial" indistinguishable at a glance during a fast-paced client call.

### Maria the Manager (History Consumer)
- Opens History to share a batch of calculations with her team. The select mode toggle (HistoryModal line 79) requires discovering a button labeled "☐ Seleccionar" — not obvious it enables multi-select. The share count "(0)" on the disabled button doesn't communicate that selection is required first.

### Carlos the New User (First-time)
- No onboarding or empty-state guidance beyond "Ingresa precio y descuentos." The relationship between the price input, discount tiles, target price, and results card is not explained. He doesn't know that discounts are sequential (multiplicative) vs additive — a critical mathematical distinction that affects the result. He might enter 10% + 10% and expect 20% off, but get 19%.

---

## Minor Observations

- The `glass-card` style has `padding: 0.6rem !important` (line 427) which overrides all other glass-card padding. This is a sledgehammer.
- DiscountRow's remove button is only visible on hover (line 145-147). On touch devices, there's no hover — the remove affordance is invisible.
- The `fromWSP` property in the history item (line 177) is set from `alsoShare` but the UI never surfaces this flag in history display.
- `formatCurrency` is called with `false` in the IGV modal result (line 400) — need to verify this doesn't produce `0.00` without the S/ prefix.
- The `handleTargetKeyDown` Enter-to-blur pattern (line 67-71) is good, but the IGV modal input uses Enter to trigger `calculateIgvRemove` (line 381) — inconsistent Enter key semantics across the same page.

---

## Questions to Consider

1. **What happens when a user enters a target price higher than the original price?** The reactive calculation on line 73 returns 0, but there's no visual feedback that the input is invalid.
2. **Should the discount mode and target price mode be mutually exclusive?** Or should they coexist — e.g., user enters discounts AND a target price, and the tool shows both the stacked result and the gap to target?
3. **Is the IGV calculator (FAB → modal) needed as a separate feature?** It duplicates what ResultsCard already shows (price with/without IGV). Could the IGV display be integrated into the results view instead?
4. **What's the actual user flow for sharing?** Does the sales rep share immediately, or always save first with client metadata? The current flow forces ObservationModal before any share — is that friction intentional?
5. **How many discounts does a typical negotiation involve?** If most use cases involve 2-3 discounts, the 4-column grid (line 454) is wasteful for single digits. If users often hit the 8-discount cap, the empty-state and overflow handling need work.

---

## Run Notes

- **Target slug:** `src-lib-components-discountspage-svelte`
- **Ignore list:** No `ignore.md` found
- **Assessment independence:** A and B ran as isolated sub-agents; no cross-contamination
- **CLI detector:** Ran successfully, 0 findings
- **Browser visualization:** Dev server started, page loaded cleanly, no console errors
- **Overlay injection:** Skipped (no browser automation available)
- **Live server cleanup:** Dev server stopped
- **Temp-file cleanup:** No temp files created
