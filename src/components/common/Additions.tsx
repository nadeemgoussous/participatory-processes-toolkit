// Markers for planner additions: content the planner typed in, which the app
// must never let pass for publication text. Every addition is rendered with
// AdditionMarker, and every place additions appear opens with AdditionsNotice.
// See docs/DECISIONS.md, 2026-11-04.

/** Inline label on each addition. Printed as well as shown on screen. */
export function AdditionMarker() {
  return (
    <span className="inline-flex items-center rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-900">
      Your addition · not part of the IRENA toolkit
    </span>
  );
}

/** Opens a section of additions, saying plainly where the content came from. */
export function AdditionsNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div
      role="note"
      className="rounded-md border border-dashed border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <p>
        <span className="font-semibold">Not part of the IRENA toolkit.</span> Everything in
        this section was entered by you or your team. It does not come from IRENA (2025),{' '}
        <em>Participatory processes for strategic energy planning</em>, and has not been
        reviewed by IRENA. It is saved with your plan and included when you export or print
        it.
      </p>
      {children}
    </div>
  );
}

/** Container style for an addition, distinct from publication cards. */
export const additionBox = 'rounded-lg border border-dashed border-amber-400 bg-white';
