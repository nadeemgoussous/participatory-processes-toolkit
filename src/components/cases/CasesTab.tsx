import { useMemo, useState } from 'react';
import { caseStudies, getCaseStudy } from '../../data/case-studies';
import { engagementTools, getTool } from '../../data/engagement-tools';
import { getProfile, stakeholderProfiles } from '../../data/stakeholder-profiles';
import type { CaseStudy, Region } from '../../types/case-study';
import { processFlows } from '../../data/figures';
import { Blocks, Section, SourceNote } from '../common/Blocks';
import { usePlan } from '../../context/PlanContext';
import { AdditionCard, AdditionForm, AdditionSection } from '../common/Additions';

const REGIONS: (Region | 'All')[] = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Global'];

export default function CasesTab() {
  const [region, setRegion] = useState<Region | 'All'>('All');
  const [selected, setSelected] = useState<string | null>(null);
  const [toolId, setToolId] = useState('');
  const [stakeholderId, setStakeholderId] = useState('');

  const study = selected ? getCaseStudy(selected) : null;

  // Filters use the classification fields on each case study, not its text.
  const visible = useMemo(
    () =>
      caseStudies.filter(
        (c) =>
          (region === 'All' || c.region === region) &&
          (!toolId || (c.toolIds as string[]).includes(toolId)) &&
          (!stakeholderId || (c.stakeholderIds as string[]).includes(stakeholderId))
      ),
    [region, toolId, stakeholderId]
  );

  if (study) {
    return <CaseDetail study={study} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
          Case studies
        </h1>
        <p className="text-gray-600">
          Thirteen participatory processes documented in chapter 5.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              region === r
                ? 'border-transparent bg-[var(--color-irena-blue)] text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FilterSelect
          label="Engagement tool"
          value={toolId}
          onChange={setToolId}
          options={engagementTools.map((t) => ({ id: t.id, name: t.name }))}
        />
        <FilterSelect
          label="Stakeholder group"
          value={stakeholderId}
          onChange={setStakeholderId}
          options={stakeholderProfiles.map((p) => ({ id: p.id, name: p.name }))}
        />
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-gray-600">No case study matches all of these filters.</p>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[68rem] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 font-medium">Country or institution</th>
              <th className="p-3 font-medium">Planning context</th>
              <th className="p-3 font-medium">Primary objectives</th>
              <th className="p-3 font-medium">Methods used</th>
              <th className="p-3 font-medium">Resource requirements</th>
              <th className="p-3 font-medium">Transferable elements</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((c) => (
              <tr key={c.id} className="align-top">
                <td className="p-3">
                  <button
                    onClick={() => setSelected(c.id)}
                    className="text-left font-medium text-[var(--color-irena-blue)] hover:underline"
                  >
                    {c.name}
                  </button>
                </td>
                <td className="p-3 text-gray-700">{c.summary.planningContext}</td>
                <td className="p-3 text-gray-700">{c.summary.primaryObjectives}</td>
                <td className="p-3 text-gray-700">{c.summary.methodsUsed}</td>
                <td className="p-3 text-gray-700">{c.summary.resourceRequirements}</td>
                <td className="p-3 text-gray-700">{c.summary.transferableElements}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SourceNote section="5, Summary Table of Case Studies" />

      <CustomCases />
    </div>
  );
}

// The summary table's own column headings, so a planner's case reads against
// the same dimensions as the publication's.
const CASE_FIELDS = [
  { key: 'planningContext', label: 'Planning context' },
  { key: 'primaryObjectives', label: 'Primary objectives' },
  { key: 'methodsUsed', label: 'Methods used' },
  { key: 'resourceRequirements', label: 'Resource requirements' },
  { key: 'transferableElements', label: 'Transferable elements' },
] as const;

/** Case studies the planner adds. Kept apart from the chapter 5 table. */
function CustomCases() {
  const { plan, addAddition, removeAddition } = usePlan();
  const cases = plan.additions.caseStudies;

  return (
    <AdditionSection id="custom-cases" heading="Your own case studies">
      {cases.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {cases.map((c) => (
            <AdditionCard
              key={c.id}
              title={c.name}
              rows={CASE_FIELDS.map((f) => ({ label: f.label, text: c[f.key] }))}
              onRemove={() => removeAddition('caseStudies', c.id)}
            />
          ))}
        </ul>
      )}
      <AdditionForm
        fields={[
          { key: 'name', label: 'Country or institution', required: true },
          ...CASE_FIELDS.map((f) => ({ key: f.key, label: f.label, multiline: true })),
        ]}
        submitLabel="Add case study"
        onSubmit={(v) =>
          addAddition('caseStudies', {
            name: v.name,
            planningContext: v.planningContext,
            primaryObjectives: v.primaryObjectives,
            methodsUsed: v.methodsUsed,
            resourceRequirements: v.resourceRequirements,
            transferableElements: v.transferableElements,
          })
        }
      />
    </AdditionSection>
  );
}

function CaseDetail({ study, onBack }: { study: CaseStudy; onBack: () => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <button onClick={onBack} className="text-sm text-[var(--color-irena-blue)] hover:underline">
        Back to all case studies
      </button>

      <header className="space-y-3">
        <p className="text-sm font-medium text-gray-500">Section {study.toolkitSection}</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
          {study.name}
        </h1>
        <p className="text-lg text-gray-700">{study.title}</p>
        {study.intro.map((p, i) => (
          <p key={i} className="text-gray-700 leading-relaxed">
            {p}
          </p>
        ))}
      </header>

      <Section heading="Overview">
        <dl className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
          {(
            [
              ['Governance', study.overview.governance],
              ['Scope', study.overview.scope],
              ['Objectives', study.overview.objectives],
            ] as [string, typeof study.overview.governance][]
          ).map(([label, value]) => (
            <div key={label} className="grid gap-1 p-4 sm:grid-cols-3">
              <dt className="font-medium text-gray-900">{label}</dt>
              <dd className="sm:col-span-2">
                <Blocks blocks={value} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section heading="Engagement activities">
        <Blocks blocks={study.engagementActivities} />
      </Section>

      <Section heading="Key outcomes">
        <Blocks blocks={study.keyOutcomes} />
      </Section>

      {study.resources.length > 0 && (
        <Section heading="Resources">
          <Blocks blocks={study.resources} />
        </Section>
      )}

      {processFlows[study.id] && (
        <Section heading="Process">
          <figure>
            <img
              src={processFlows[study.id]}
              alt={`Process flow for the ${study.name} case study, from inputs through process and activities to outcomes.`}
              loading="lazy"
              className="w-full rounded-lg border border-gray-200"
            />
          </figure>
        </Section>
      )}

      <Section heading="Highlight">
        <p className="rounded-lg border-l-4 border-[var(--color-irena-orange)] bg-orange-50 p-4 text-gray-800">
          {study.highlight}
        </p>
      </Section>

      <Section heading="Lessons learnt">
        <ol className="space-y-2">
          {study.lessonsLearnt.map((lesson, i) => (
            <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="font-medium text-gray-400">{i + 1}.</span>
              <span>{lesson}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section heading="Resource requirements">
        <p className="text-gray-700">{study.summary.resourceRequirements}</p>
      </Section>

      <Section heading="Transferable elements">
        <p className="text-gray-700">{study.summary.transferableElements}</p>
      </Section>

      <div className="grid gap-6 sm:grid-cols-2">
        <Section heading="Stakeholders engaged">
          <div className="flex flex-wrap gap-2">
            {study.stakeholderIds.map((id) => {
              const profile = getProfile(id);
              return (
                <span
                  key={id}
                  className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-800"
                >
                  {profile ? profile.name : id}
                </span>
              );
            })}
          </div>
        </Section>

        <Section heading="Tools used">
          <div className="flex flex-wrap gap-2">
            {study.toolIds.map((id) => {
              const tool = getTool(id);
              if (!tool) return null;
              return (
                <span
                  key={id}
                  className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-800"
                >
                  {tool.name}
                </span>
              );
            })}
          </div>
        </Section>
      </div>

      <SourceNote section={study.toolkitSection} />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[var(--color-irena-blue)] focus:outline-none"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
