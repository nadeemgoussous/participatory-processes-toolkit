import { useState } from 'react';
import { stakeholderProfiles, getProfile } from '../../data/stakeholder-profiles';
import { getCaseStudiesForStakeholder } from '../../data/case-studies';
import { stakeholderIcons } from '../../data/figures';
import type { StakeholderProfile, StakeholderId } from '../../types/stakeholder';
import { Blocks, Bullets, Section, SourceNote } from '../common/Blocks';
import { usePlan } from '../../context/PlanContext';
import { AdditionMarker, AdditionsNotice, additionBox } from '../common/Additions';

export default function StakeholdersTab() {
  const [selected, setSelected] = useState<StakeholderId | null>(null);
  const profile = selected ? getProfile(selected) : null;

  if (profile) {
    return <ProfileDetail profile={profile} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
          Stakeholders
        </h1>
        <p className="text-gray-600">
          The seven groups described in chapter 3, with the reasons to engage them, the
          challenges involved, and the good practices identified for each.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {stakeholderProfiles.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => setSelected(p.id)}
              className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-5 text-left transition-colors hover:border-[var(--color-irena-blue)]"
            >
              {stakeholderIcons[p.id] && (
                <img
                  src={stakeholderIcons[p.id]}
                  alt=""
                  aria-hidden="true"
                  className="mb-3 h-10 w-10"
                />
              )}
              <span className="font-semibold text-gray-900">{p.name}</span>
              <span className="mt-2 text-sm text-gray-500">Section {p.toolkitSection}</span>
            </button>
          </li>
        ))}
      </ul>

      <SourceNote section="3" />

      <CustomGroups />
    </div>
  );
}

/** Groups the planner adds. Kept after the chapter 3 groups and their source note. */
function CustomGroups() {
  const { plan, addStakeholder, removeStakeholder } = usePlan();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const groups = plan.additions.stakeholders;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addStakeholder({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
  };

  return (
    <section aria-labelledby="custom-groups" className="space-y-4 border-t border-gray-200 pt-8">
      <h2 id="custom-groups" className="text-xl font-semibold text-gray-900">
        Your own stakeholder groups
      </h2>
      <AdditionsNotice />

      {groups.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {groups.map((g) => (
            <li key={g.id} className={`${additionBox} flex flex-col gap-2 p-5`}>
              <span className="font-semibold text-gray-900">{g.name}</span>
              {g.description && (
                <span className="whitespace-pre-line text-sm text-gray-700">{g.description}</span>
              )}
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <AdditionMarker />
                <button
                  onClick={() => removeStakeholder(g.id)}
                  aria-label={`Remove ${g.name}`}
                  className="text-sm text-gray-500 hover:text-red-700 hover:underline print:hidden"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className={`${additionBox} space-y-3 p-5 print:hidden`}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Group name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[var(--color-irena-blue)] focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Who they are and why they matter to this plan (optional)
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-irena-blue)] focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-md bg-[var(--color-irena-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-irena-blue-dark)] disabled:opacity-50"
        >
          Add group
        </button>
      </form>
    </section>
  );
}

function ProfileDetail({
  profile,
  onBack,
}: {
  profile: StakeholderProfile;
  onBack: () => void;
}) {
  const { plan, setSetup } = usePlan();
  const inPlan = plan.setup.stakeholders.includes(profile.id);
  const studies = getCaseStudiesForStakeholder(profile.id);

  const toggle = () =>
    setSetup({
      stakeholders: inPlan
        ? plan.setup.stakeholders.filter((s) => s !== profile.id)
        : [...plan.setup.stakeholders, profile.id],
    });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <button onClick={onBack} className="text-sm text-[var(--color-irena-blue)] hover:underline">
        Back to all stakeholders
      </button>

      <header className="space-y-3">
        <p className="text-sm font-medium text-gray-500">Section {profile.toolkitSection}</p>
        <div className="flex items-center gap-4">
          {stakeholderIcons[profile.id] && (
            <img
              src={stakeholderIcons[profile.id]}
              alt=""
              aria-hidden="true"
              className="h-12 w-12 shrink-0"
            />
          )}
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
            {profile.name}
          </h1>
        </div>
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

      <Section heading="Who are they?">
        <Blocks blocks={profile.whoAreThey} />
      </Section>

      <Section heading="Why engage them?">
        <Blocks blocks={profile.whyEngage} />
      </Section>

      <Section heading="What is the benefit for them?">
        <Blocks blocks={profile.benefit} />
      </Section>

      <Section heading="Challenges in engaging">
        <dl className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
          {profile.challenges.map((c) => (
            <div key={c.challenge} className="grid gap-1 p-4 sm:grid-cols-3">
              <dt className="font-medium text-gray-900">{c.challenge}</dt>
              <dd className="text-gray-700 sm:col-span-2">{c.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section heading="Good practices">
        <Bullets items={profile.goodPractices} />
      </Section>

      {studies.length > 0 && (
        <Section heading="Case studies engaging this group">
          <div className="flex flex-wrap gap-2">
            {studies.map((s) => (
              <span
                key={s.id}
                className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-800"
              >
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      <SourceNote section={profile.toolkitSection} />
    </div>
  );
}
