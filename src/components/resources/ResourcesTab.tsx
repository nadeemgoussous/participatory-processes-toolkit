import { frameworks, publications, resourceGroups } from '../../data/resources';
import { ExternalLink, Section, SourceNote } from '../common/Blocks';

export default function ResourcesTab() {
  const detailed = resourceGroups;

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-gray-500">Section 7</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
          Additional material
        </h1>
        <p className="text-gray-600">
          Publications, tools and platforms listed in chapter 7. Links open externally;
          nothing here is loaded by this page.
        </p>
      </header>

      <Section heading="7.1 Publications">
        <div className="space-y-4">
          {publications.map((publication) => (
            <article
              key={publication.id}
              className="space-y-2 rounded-lg border border-gray-200 bg-white p-5"
            >
              <h3 className="font-semibold text-gray-900">{publication.title}</h3>
              <p className="text-sm text-gray-500">{publication.author}</p>
              <p className="text-gray-700 leading-relaxed">{publication.description}</p>
              <div className="flex flex-col gap-1 pt-1">
                {publication.links.map((link) => (
                  <ExternalLink key={link.url} url={link.url} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {detailed.map((group) => (
        <Section key={group.id} heading={`7.2 Tools and platforms: ${group.label}`}>
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {group.entries.map((entry) => (
              <li key={entry.name} className="space-y-1 p-4">
                <p className="font-medium text-gray-900">{entry.name}</p>
                {entry.description && <p className="text-gray-700">{entry.description}</p>}
                {entry.url && <ExternalLink url={entry.url} />}
              </li>
            ))}
          </ul>
        </Section>
      ))}


      <Section heading="7.2 Frameworks">
        <div className="space-y-4">
          {frameworks.map((framework) => (
            <article
              key={framework.id}
              className="space-y-2 rounded-lg border border-gray-200 bg-white p-5"
            >
              <h3 className="font-semibold text-gray-900">{framework.name}</h3>
              <p className="text-gray-700 leading-relaxed">{framework.description}</p>
              {framework.url && <ExternalLink url={framework.url} />}
            </article>
          ))}
        </div>
      </Section>


      <SourceNote section="7" />
    </div>
  );
}
