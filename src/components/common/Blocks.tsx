import type { ContentBlock } from '../../types/toolkit';

/** Renders the paragraph and list runs that make up a publication section. */
export function Blocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div key={i} className="space-y-2">
          {block.text && <p className="text-gray-700 leading-relaxed">{block.text}</p>}
          {block.label && <p className="font-medium text-gray-900">{block.label}</p>}
          {block.items && <Bullets items={block.items} />}
        </div>
      ))}
    </div>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-gray-700 leading-relaxed">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 translate-y-[0.6em] rounded-full bg-gray-400"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{heading}</h3>
      {children}
    </section>
  );
}

/** A table the publication presents. */
export function Table({
  columns,
  rows,
  caption,
}: {
  columns: string[];
  rows: string[][];
  caption?: string;
}) {
  return (
    <div className="space-y-2">
      {caption && <p className="font-medium text-gray-900">{caption}</p>}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              {columns.map((column) => (
                <th key={column} className="p-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, i) => (
              <tr key={i} className="align-top">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={j === 0 ? 'p-3 font-medium text-gray-900' : 'p-3 text-gray-700'}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** An external link the publication lists. */
export function ExternalLink({ url, label }: { url: string; label?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="break-all text-sm text-[var(--color-irena-blue)] hover:underline"
    >
      {label ?? url}
    </a>
  );
}

/** Reference line shown at the foot of any panel built from the publication. */
export function SourceNote({ section }: { section: string }) {
  return (
    <p className="border-t border-gray-200 pt-4 text-sm text-gray-500">
      Source: IRENA (2025), <em>Participatory processes for strategic energy planning: A toolkit
      for national energy planners</em>, section {section}.
    </p>
  );
}
