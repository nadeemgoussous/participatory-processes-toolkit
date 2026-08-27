import {
  chapterIntro,
  participationObjectives,
  rationaleSections,
} from '../../data/participation-rationale';
import { Blocks, Section, SourceNote, Table } from '../common/Blocks';

export default function WhyTab() {
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-gray-500">Section 2</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
          The importance of participatory processes
        </h1>
        <Blocks blocks={chapterIntro} />
      </header>

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

      <SourceNote section="2" />
    </div>
  );
}
