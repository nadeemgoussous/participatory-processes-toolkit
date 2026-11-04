// Planner additions: content the planner typed in, which the app must never let
// pass for publication text. Every addition is rendered with AdditionMarker,
// every place additions appear is an AdditionSection (which opens with the
// notice), and sections come after the publication content and its SourceNote.
// See docs/DECISIONS.md, 2026-11-04.

import { useState } from 'react';
import { PHASES } from '../../types/toolkit';
import type { Phase } from '../../types/toolkit';
import { Chooser, toggle } from './Chooser';

/** Inline label on each addition. Printed as well as shown on screen. */
export function AdditionMarker() {
  return (
    <span className="inline-flex items-center rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-900">
      Your addition · not part of the IRENA toolkit
    </span>
  );
}

/** Opens a section of additions, saying plainly where the content came from. */
export function AdditionsNotice() {
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
    </div>
  );
}

/** Container style for an addition, distinct from publication cards. */
export const additionBox = 'rounded-lg border border-dashed border-amber-400 bg-white';

export function AdditionSection({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="space-y-4 border-t border-gray-200 pt-8">
      <h2 id={id} className="text-xl font-semibold text-gray-900">
        {heading}
      </h2>
      <AdditionsNotice />
      {children}
    </section>
  );
}

/** One addition shown as a card: a title, labelled fields, the marker. */
export function AdditionCard({
  title,
  rows,
  onRemove,
}: {
  title: string;
  rows: { label?: string; text: string }[];
  onRemove: () => void;
}) {
  return (
    <li className={`${additionBox} flex flex-col gap-2 p-5`}>
      <span className="font-semibold text-gray-900">{title}</span>
      {rows
        .filter((r) => r.text)
        .map((r, i) => (
          <div key={i} className="text-sm">
            {r.label && <p className="font-medium text-gray-500">{r.label}</p>}
            <p className="whitespace-pre-line text-gray-700">{r.text}</p>
          </div>
        ))}
      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <AdditionMarker />
        <button
          onClick={onRemove}
          aria-label={`Remove ${title}`}
          className="text-sm text-gray-500 hover:text-red-700 hover:underline print:hidden"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export interface AdditionField {
  key: string;
  label: string;
  multiline?: boolean;
  /** The first required field must be filled before the form submits. */
  required?: boolean;
}

/** Form for a new addition. Fields are free text; phases are optional. */
export function AdditionForm({
  fields,
  withPhases,
  submitLabel,
  onSubmit,
  children,
}: {
  fields: AdditionField[];
  withPhases?: boolean;
  submitLabel: string;
  /** Extra controls, placed after the fields and before the submit button. */
  children?: React.ReactNode;
  onSubmit: (values: Record<string, string>, phases: Phase[]) => void;
}) {
  const blank = () => Object.fromEntries(fields.map((f) => [f.key, '']));
  const [values, setValues] = useState<Record<string, string>>(blank);
  const [phases, setPhases] = useState<Phase[]>([]);
  const ready = fields.filter((f) => f.required).every((f) => values[f.key].trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    onSubmit(
      Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()])),
      phases
    );
    setValues(blank());
    setPhases([]);
  };

  const input =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-irena-blue)] focus:outline-none';

  return (
    <form onSubmit={submit} className={`${additionBox} space-y-4 p-5 print:hidden`}>
      {fields.map((f) => (
        <label key={f.key} className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            {f.label}
            {!f.required && ' (optional)'}
          </span>
          {f.multiline ? (
            <textarea
              value={values[f.key]}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              rows={2}
              className={`${input} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={values[f.key]}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className={input}
            />
          )}
        </label>
      ))}
      {withPhases && (
        <Chooser
          legend="Phases (optional; none means all)"
          options={PHASES.map((p) => ({ id: p.id, label: p.label, hint: p.detail }))}
          selected={phases}
          onToggle={(id) => setPhases(toggle(phases, id as Phase))}
        />
      )}
      {children}
      <button
        type="submit"
        disabled={!ready}
        className="rounded-md bg-[var(--color-irena-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-irena-blue-dark)] disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export function phaseLabels(phases: Phase[]): string {
  return PHASES.filter((p) => phases.includes(p.id))
    .map((p) => p.label)
    .join(', ');
}
