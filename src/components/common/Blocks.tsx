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
          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
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

/** Reference line shown at the foot of any panel built from the publication. */
export function SourceNote({ section }: { section: string }) {
  return (
    <p className="border-t border-gray-200 pt-4 text-sm text-gray-500">
      Source: IRENA (2025), <em>Participatory processes for strategic energy planning: A toolkit
      for national energy planners</em>, section {section}.
    </p>
  );
}
