/** Multi-select row of toggle buttons. type="button" so it can sit inside a form. */
export function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function Chooser({
  legend,
  options,
  selected,
  onToggle,
  extra,
}: {
  legend: string;
  options: { id: string; label: string; hint?: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  /** Shown after the options, for example the planner's own additions. */
  extra?: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gray-700">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onToggle(o.id)}
              title={o.hint}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? 'border-transparent bg-[var(--color-irena-blue)] text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {extra}
    </fieldset>
  );
}
