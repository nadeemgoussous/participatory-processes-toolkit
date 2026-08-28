import { useMemo, useRef, useState } from 'react';
import { selectItems } from '../../data/checklist';
import { CHECKLIST_GROUPS } from '../../types/checklist';
import type { ChecklistItem } from '../../types/checklist';
import { engagementTools, objectives, getTool } from '../../data/engagement-tools';
import { stakeholderProfiles, getProfile } from '../../data/stakeholder-profiles';
import { PHASES } from '../../types/toolkit';
import type { Phase, ToolId } from '../../types/toolkit';
import type { StakeholderId } from '../../types/stakeholder';
import { usePlan } from '../../context/PlanContext';
import { exportPlan, importPlan } from '../../utils/plan-storage';
import {
  challengesIntro,
  currentChallenges,
  projectDesignQuestions,
  threeStepGuide,
  threeStepIntro,
  usingTheToolkit,
} from '../../data/using-the-toolkit';
import { Blocks, Disclosure } from '../common/Blocks';

export default function PlanTab() {
  const { plan, setMeta, setSetup, setItem, replacePlan } = usePlan();
  const [showSetup, setShowSetup] = useState(true);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const items = useMemo(() => selectItems(plan.setup), [plan.setup]);

  const done = items.filter((i) => plan.items[i.id]?.done).length;
  const noted = items.filter((i) => plan.items[i.id]?.note.trim()).length;

  const handleImport = async (file: File) => {
    try {
      replacePlan(await importPlan(file));
      setImportError(null);
    } catch {
      setImportError('That file could not be read as a participation plan.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
          Participation plan
        </h1>
        <p className="text-gray-600">
          A checklist for a participatory process, drawn from the prerequisites, resource
          requirements and good practices in the toolkit. Choose your phases, stakeholders
          and tools, and the checklist narrows to what applies.
        </p>
      </header>

      <Disclosure summary="how to use this toolkit">
        <Blocks blocks={threeStepIntro} />
        {threeStepGuide.map((step) => (
          <div key={step.id} className="space-y-2">
            <h3 className="font-medium text-gray-900">{step.heading}</h3>
            <Blocks blocks={step.blocks} />
          </div>
        ))}
        <div className="space-y-3 border-t border-gray-100 pt-5">
          <Blocks blocks={[{ items: usingTheToolkit }]} />
        </div>
        <p className="border-t border-gray-100 pt-4 text-sm text-gray-500">
          Sections 1.3 and 6.
        </p>
      </Disclosure>

      <section className="rounded-lg border border-gray-200 bg-white p-5 print:hidden">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Plan name</span>
            <input
              type="text"
              value={plan.name}
              onChange={(e) => setMeta({ name: e.target.value })}
              placeholder="Long-term energy plan consultation"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[var(--color-irena-blue)] focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Country</span>
            <input
              type="text"
              value={plan.country}
              onChange={(e) => setMeta({ country: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[var(--color-irena-blue)] focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setShowSetup((s) => !s)}
            className="text-sm font-medium text-[var(--color-irena-blue)] hover:underline"
          >
            {showSetup ? 'Hide selection' : 'Change selection'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => exportPlan(plan)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400"
            >
              Export
            </button>
            <button
              onClick={() => fileInput.current?.click()}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400"
            >
              Import
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400"
            >
              Print
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImport(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
        {importError && <p className="mt-3 text-sm text-red-700">{importError}</p>}

        {showSetup && (
          <div className="mt-5 space-y-5 border-t border-gray-200 pt-5">
            <Chooser
              legend="Which phases does this plan cover?"
              options={PHASES.map((p) => ({ id: p.id, label: p.label, hint: p.detail }))}
              selected={plan.setup.phases}
              onToggle={(id) =>
                setSetup({
                  phases: toggle(plan.setup.phases, id as Phase),
                })
              }
            />
            <Chooser
              legend="Which stakeholder groups are most critical?"
              options={stakeholderProfiles.map((p) => ({ id: p.id, label: p.name }))}
              selected={plan.setup.stakeholders}
              onToggle={(id) =>
                setSetup({
                  stakeholders: toggle(plan.setup.stakeholders, id as StakeholderId),
                })
              }
            />
            <ObjectivePicker />
            <Chooser
              legend="Which tools will you use?"
              options={engagementTools.map((t) => ({ id: t.id, label: t.name }))}
              selected={plan.setup.tools}
              onToggle={(id) => setSetup({ tools: toggle(plan.setup.tools, id as ToolId) })}
            />
          </div>
        )}
      </section>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <p className="text-gray-700">
          <span className="font-semibold text-gray-900">{done}</span> of {items.length} items
          checked, <span className="font-semibold text-gray-900">{noted}</span> with notes.
        </p>
        <p className="mt-1 text-sm text-gray-600">
          The toolkit identifies engagement treated as a &quot;box-ticking&quot; exercise as a
          challenge that decreases confidence among stakeholders. Use the notes to record how
          each item was addressed.
        </p>
      </div>

      <Disclosure summary="the challenges a checklist does not solve">
        <Blocks blocks={[{ items: currentChallenges }]} />
        <div className="space-y-2">
          <p className="text-gray-700 leading-relaxed">{challengesIntro}</p>
          <ul className="space-y-1.5">
            {projectDesignQuestions.map((question) => (
              <li key={question} className="flex gap-2 text-gray-700 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 translate-y-[0.6em] rounded-full bg-gray-400"
                />
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="border-t border-gray-100 pt-4 text-sm text-gray-500">
          Section 6, Challenges and Future Work.
        </p>
      </Disclosure>

      {CHECKLIST_GROUPS.map((group) => {
        const groupItems = items.filter((i) => i.group === group.id);
        if (groupItems.length === 0) return null;
        return (
          <section key={group.id} className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">{group.label}</h2>
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
              {groupItems.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  state={plan.items[item.id]}
                  onChange={(patch) => setItem(item.id, patch)}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );

  function ObjectivePicker() {
    return (
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-gray-700">
          What is your objective? Selecting one suggests tools.
        </legend>
        <div className="flex flex-wrap gap-2">
          {objectives.map((o) => {
            const active = plan.setup.objectiveId === o.id;
            return (
              <button
                key={o.id}
                onClick={() =>
                  setSetup(
                    active
                      ? { objectiveId: undefined }
                      : {
                          objectiveId: o.id,
                          tools: Array.from(new Set([...plan.setup.tools, ...o.tools])),
                        }
                  )
                }
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
      </fieldset>
    );
  }
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Chooser({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  options: { id: string; label: string; hint?: string }[];
  selected: string[];
  onToggle: (id: string) => void;
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
    </fieldset>
  );
}

/**
 * Which tool or stakeholder section an item came from. A group mixes items from
 * several tools, and a section number alone does not say which is which.
 */
function itemOrigin(item: ChecklistItem): string {
  if (item.toolId) return getTool(item.toolId)?.name ?? '';
  if (item.stakeholderId) return getProfile(item.stakeholderId)?.name ?? '';
  return '';
}

function Item({
  item,
  state,
  onChange,
}: {
  item: ChecklistItem;
  state?: { done: boolean; note: string };
  onChange: (patch: { done?: boolean; note?: string }) => void;
}) {
  const done = state?.done ?? false;
  const note = state?.note ?? '';

  return (
    <li className="p-4">
      <div className="flex gap-3">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => onChange({ done: e.target.checked })}
          id={item.id}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-irena-blue)]"
        />
        <div className="min-w-0 flex-1">
          <label htmlFor={item.id} className="block text-gray-800">
            {item.text}
          </label>
          <p className="mt-1 text-xs text-gray-500">
            {itemOrigin(item)}
            {itemOrigin(item) && ' · '}
            {item.source}
          </p>
          <textarea
            value={note}
            onChange={(e) => onChange({ note: e.target.value })}
            rows={note ? 3 : 1}
            placeholder="How is this being addressed?"
            className="mt-2 w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-irena-blue)] focus:outline-none"
          />
        </div>
      </div>
    </li>
  );
}
