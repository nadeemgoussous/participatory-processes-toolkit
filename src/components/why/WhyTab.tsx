import {
  chapterIntro,
  participationObjectives,
  rationaleSections,
} from '../../data/participation-rationale';
import {
  aboutSections,
  backgroundSections,
  futureOpportunities,
  keyTakeaways,
} from '../../data/toolkit-background';
import { Blocks, Disclosure, Section, SourceNote, Table } from '../common/Blocks';

export default function WhyTab() {
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-gray-500">Sections 1 and 2</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
          Why participate
        </h1>
      </header>

      {backgroundSections.map((section) => (
        <Section key={section.id} heading={section.heading}>
          <Blocks blocks={section.blocks} />
        </Section>
      ))}

      <Section heading="2 The importance of participatory processes">
        <Blocks blocks={chapterIntro} />
      </Section>

      {rationaleSections.map((section) => (
        <Section key={section.id} heading={`${section.toolkitSection} ${section.heading}`}>
          <Blocks blocks={section.blocks} />
          {section.table && (
            <div className="pt-2">
              <Table
                caption={section.table.caption}
                columns={section.table.columns}
                rows={section.table.rows}
              />
            </div>
          )}
        </Section>
      ))}

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          2.4 How do participatory processes support energy planning?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Participatory processes have multiple possible objectives when organised by
          governments and can bring numerous benefits to the energy planning process itself,
          as well as to the participants.
        </p>

        {participationObjectives.map((objective) => (
          <article
            key={objective.id}
            className="space-y-3 rounded-lg border border-gray-200 bg-white p-5"
          >
            <h3 className="font-semibold text-gray-900">{objective.heading}</h3>
            <Blocks blocks={objective.blocks} />
            {objective.table && (
              <Table
                caption={objective.table.caption}
                columns={objective.table.columns}
                rows={objective.table.rows}
              />
            )}
          </article>
        ))}
      </div>

      <Section heading="Summary: benefits of participatory processes">
        <Table
          columns={['Objective', 'Key benefit']}
          rows={participationObjectives.map((o) => [o.summaryObjective, o.summaryBenefit])}
        />
      </Section>

      <Section heading="Key takeaways">
        <ol className="space-y-2">
          {keyTakeaways.map((takeaway, i) => (
            <li key={takeaway} className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="font-medium text-gray-400">{i + 1}.</span>
              <span>{takeaway}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Disclosure summary="about this toolkit and how it was developed">
        {aboutSections.map((section) => (
          <div key={section.id} className="space-y-2">
            <h3 className="font-medium text-gray-900">
              {section.toolkitSection} {section.heading}
            </h3>
            <Blocks blocks={section.blocks} />
          </div>
        ))}
        <div className="space-y-2 border-t border-gray-100 pt-5">
          <h3 className="font-medium text-gray-900">Future opportunities</h3>
          <Blocks blocks={futureOpportunities} />
        </div>
        <p className="border-t border-gray-100 pt-4 text-sm text-gray-500">
          Sections 1.1, 1.2 and 6.
        </p>
      </Disclosure>

      <SourceNote section="1, 2 and 6" />
    </div>
  );
}
