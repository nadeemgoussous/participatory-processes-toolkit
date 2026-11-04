import { useState } from 'react';
import { engagementTools, objectives, getTool } from '../../data/engagement-tools';
import { getCaseStudy } from '../../data/case-studies';
import { PHASES, TOOL_CATEGORIES } from '../../types/toolkit';
import type { EngagementTool, Phase, ToolId } from '../../types/toolkit';
import { figures } from '../../data/figures';
import { Bullets, FigureImage, Section, SourceNote } from '../common/Blocks';
import { usePlan } from '../../context/PlanContext';
import { AdditionCard, AdditionForm, AdditionSection, phaseLabels } from '../common/Additions';

type Route = 'objective' | 'phase' | 'category';

export default function ToolsTab() {
  const [route, setRoute] = useState<Route>('objective');
  const [selected, setSelected] = useState<ToolId | null>(null);

  const tool = selected ? getTool(selected) : null;

  if (tool) {
    return <ToolDetail tool={tool} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
          Engagement tools
        </h1>
        <p className="text-gray-600">
          The seven tools described in chapter 4, and the decision framework for choosing
          between them.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Ways to browse the tools">
        {(
          [
            ['objective', 'By objective'],
            ['phase', 'By planning phase'],
            ['category', 'By category'],
          ] as [Route, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setRoute(id)}
            className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              route === id
                ? 'border-transparent bg-[var(--color-irena-blue)] text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {route === 'objective' && <ByObjective onSelect={setSelected} />}
      {route === 'phase' && <ByPhase onSelect={setSelected} />}
      {route === 'category' && <ByCategory onSelect={setSelected} />}

      <CustomTools />
    </div>
  );
}

/** Tools and activities the planner adds. Kept after the chapter 4 routes. */
function CustomTools() {
  const { plan, addAddition, removeAddition } = usePlan();
  const tools = plan.additions.tools;

  return (
    <AdditionSection id="custom-tools" heading="Your own engagement tools and activities">
      {tools.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {tools.map((t) => (
            <AdditionCard
              key={t.id}
              title={t.name}
              rows={[{ text: t.description }, { label: 'Phases', text: phaseLabels(t.phases) }]}
              onRemove={() => removeAddition('tools', t.id)}
            />
          ))}
        </ul>
      )}
      <AdditionForm
        fields={[
          { key: 'name', label: 'Tool or activity', required: true },
          { key: 'description', label: 'How you will use it', multiline: true },
        ]}
        withPhases
        submitLabel="Add tool"
        onSubmit={(v, phases) =>
          addAddition('tools', { name: v.name, description: v.description, phases })
        }
      />
    </AdditionSection>
  );
}

function ByObjective({ onSelect }: { onSelect: (id: ToolId) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Step 4 of the Tool Selection Decision Framework maps objectives to tools.
      </p>
      {objectives.map((objective) => (
        <div key={objective.id} className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            If your objective is
          </p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">{objective.label}</h2>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Consider
          </p>
          <p className="mt-1 text-gray-700">{objective.consider}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {objective.tools.map((id) => (
              <ToolChip key={id} id={id} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}
      <SourceNote section="4, Tool Selection Decision Framework" />
    </div>
  );
}

function ByPhase({ onSelect }: { onSelect: (id: ToolId) => void }) {
  return (
    <div className="space-y-6">
      {PHASES.map((phase) => (
        <div key={phase.id} className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">{phase.label}</h2>
          <p className="mt-1 text-gray-600">{phase.detail}</p>
          <ul className="mt-4 divide-y divide-gray-100">
            {engagementTools
              .filter((t) => t.stageApplications[phase.id])
              .map((t) => (
                <li key={t.id} className="py-3">
                  <button
                    onClick={() => onSelect(t.id)}
                    className="text-left font-medium text-[var(--color-irena-blue)] hover:underline"
                  >
                    {t.name}
                  </button>
                  <p className="text-sm text-gray-600">{t.stageApplications[phase.id]}</p>
                </li>
              ))}
          </ul>
        </div>
      ))}
      <SourceNote section="4, Summary: Tools by Implementation Stage" />
    </div>
  );
}

function ByCategory({ onSelect }: { onSelect: (id: ToolId) => void }) {
  return (
    <div className="space-y-6">
      <FigureImage figure={figures[4]} />
      {TOOL_CATEGORIES.map((category) => (
        <div key={category.id} className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">{category.label}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {engagementTools
              .filter((t) => t.category === category.id)
              .map((t) => (
                <ToolChip key={t.id} id={t.id} onSelect={onSelect} />
              ))}
          </div>
        </div>
      ))}
      <SourceNote section="4, Overview: Three Categories of Engagement Tools" />
    </div>
  );
}

function ToolChip({ id, onSelect }: { id: ToolId; onSelect: (id: ToolId) => void }) {
  const tool = getTool(id);
  if (!tool) return null;
  return (
    <button
      onClick={() => onSelect(id)}
      className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-800 transition-colors hover:border-[var(--color-irena-blue)] hover:text-[var(--color-irena-blue)]"
    >
      {tool.name}
    </button>
  );
}

function ToolDetail({ tool, onBack }: { tool: EngagementTool; onBack: () => void }) {
  const { plan, setSetup } = usePlan();
  const inPlan = plan.setup.tools.includes(tool.id);

  const toggle = () =>
    setSetup({
      tools: inPlan
        ? plan.setup.tools.filter((t) => t !== tool.id)
        : [...plan.setup.tools, tool.id],
    });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <button onClick={onBack} className="text-sm text-[var(--color-irena-blue)] hover:underline">
        Back to all tools
      </button>

      <header className="space-y-3">
        <p className="text-sm font-medium text-gray-500">Section {tool.toolkitSection}</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
          {tool.name}
        </h1>
        {tool.summary.map((p, i) => (
          <p key={i} className="text-gray-700 leading-relaxed">
            {p}
          </p>
        ))}
        <button
          onClick={toggle}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            inPlan
              ? 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              : 'bg-[var(--color-irena-blue)] text-white hover:bg-[var(--color-irena-blue-dark)]'
          }`}
        >
          {inPlan ? 'Remove from plan' : 'Add to plan'}
        </button>
      </header>

      <Section heading="Implementation stage">
        <dl className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
          {PHASES.filter((p) => tool.stageApplications[p.id]).map((phase) => (
            <div key={phase.id} className="grid gap-1 p-4 sm:grid-cols-3">
              <dt className="font-medium text-gray-900">{phase.label}</dt>
              <dd className="text-gray-700 sm:col-span-2">
                {tool.stageApplications[phase.id as Phase]}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section heading="Resource requirements and prerequisites">
        <Bullets items={tool.requirements} />
      </Section>


      <Section heading="Practical considerations">
        <div className="grid gap-4 md:grid-cols-3">
          <Consideration title="Strengths" items={tool.strengths} />
          <Consideration title="Challenges" items={tool.challenges} />
          <Consideration title="Limitations" items={tool.limitations} />
        </div>
      </Section>


      {tool.evidence.length > 0 && (
        <Section heading="Implementation evidence">
          <Bullets items={tool.evidence} />
        </Section>
      )}

      {tool.box && tool.boxLabel && (
        <Section heading={tool.boxLabel}>
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {tool.box.map((row) => (
              <div key={row.name} className="p-4">
                <p className="font-medium text-gray-900">{row.name}</p>
                <p className="mt-1 text-gray-700">{row.description}</p>
                {row.bestFor && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Best for:</span> {row.bestFor}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {tool.caseStudyIds.length > 0 && (
        <Section heading="Case studies using this tool">
          <div className="flex flex-wrap gap-2">
            {tool.caseStudyIds.map((id) => {
              const study = getCaseStudy(id);
              if (!study) return null;
              return (
                <span
                  key={id}
                  className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-800"
                >
                  {study.name}
                </span>
              );
            })}
          </div>
        </Section>
      )}

      <SourceNote section={tool.toolkitSection} />
    </div>
  );
}

function Consideration({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-2 font-medium text-gray-900">{title}</h4>
      <Bullets items={items} />
    </div>
  );
}
