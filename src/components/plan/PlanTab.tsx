import { useMemo, useRef, useState } from 'react';
import { selectItems } from '../../data/checklist';
import { CHECKLIST_GROUPS } from '../../types/checklist';
import type { CustomItem } from '../../types/checklist';
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
import { AdditionForm, AdditionMarker, AdditionSection, additionBox, phaseLabels } from '../common/Additions';
import { Chooser, toggle } from '../common/Chooser';

export default function PlanTab() {
  const { plan, setMeta, setSetup, setItem, replacePlan } = usePlan();
  const [showSetup, setShowSetup] = useState(true);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const items = useMemo(() => selectItems(plan.setup), [plan.setup]);

  const done = items.filter((i) => plan.items[i.id]?.done).length;
  const noted = items.filter((i) => plan.items[i.id]?.note.trim()).length;

  const ownItems = plan.additions.items.filter(
    (i) =>
      i.phases.length === 0 ||
      plan.setup.phases.length === 0 ||
      i.phases.some((p) => plan.setup.phases.includes(p))
  );
  const ownDone = ownItems.filter((i) => plan.items[i.id]?.done).length;

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
          {ownItems.length > 0 && (
            <>
              {' '}
              Of your own items, <span className="font-semibold text-gray-900">{ownDone}</span>{' '}
              of {ownItems.length} checked.
            </>
          )}
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
                  id={item.id}
                  text={item.text}
                  meta={
                    <span>
                      {itemOrigin(item)}
                      {itemOrigin(item) && ' · '}
                      {item.source}
                    </span>
                  }
                  state={plan.items[item.id]}
                  onChange={(patch) => setItem(item.id, patch)}
                />
              ))}
            </ul>
          </section>
        );
      })}

      <OwnItems visible={ownItems} />
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

/**
 * Which tool or stakeholder section an item came from. A group mixes items from
 * several tools, and a section number alone does not say which is which.
 */
function itemOrigin(item: { toolId?: ToolId; stakeholderId?: StakeholderId }): string {
  if (item.toolId) return getTool(item.toolId)?.name ?? '';
  if (item.stakeholderId) return getProfile(item.stakeholderId)?.name ?? '';
  return '';
}

function Item({
  id,
  text,
  meta,
  state,
  onChange,
  onRemove,
}: {
  id: string;
  text: string;
  meta: React.ReactNode;
  state?: { done: boolean; note: string };
  onChange: (patch: { done?: boolean; note?: string }) => void;
  onRemove?: () => void;
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
          id={id}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-irena-blue)]"
        />
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="block whitespace-pre-line text-gray-800">
            {text}
          </label>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            {meta}
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-gray-500 hover:text-red-700 hover:underline print:hidden"
              >
                Remove
              </button>
            )}
          </div>
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

/**
 * Checklist items the planner adds. They follow the publication's groups rather
 * than joining them, so no addition ever sits inside a list of quoted text.
 */
function OwnItems({ visible }: { visible: CustomItem[] }) {
  const { plan, setItem, addAddition, removeAddition } = usePlan();
  const [stakeholderId, setStakeholderId] = useState('');
  const [toolId, setToolId] = useState('');

  const groupOptions = [
    ...plan.additions.stakeholders.map((g) => ({ id: g.id, name: `${g.name} (your group)` })),
    ...stakeholderProfiles.map((p) => ({ id: p.id, name: p.name })),
  ];
  const toolOptions = [
    ...plan.additions.tools.map((t) => ({ id: t.id, name: `${t.name} (your tool)` })),
    ...engagementTools.map((t) => ({ id: t.id, name: t.name })),
  ];
  const groupName = (id?: string) =>
    plan.additions.stakeholders.find((g) => g.id === id)?.name ??
    (id ? getProfile(id as StakeholderId)?.name : undefined);
  const toolName = (id?: string) =>
    plan.additions.tools.find((t) => t.id === id)?.name ??
    (id ? getTool(id as ToolId)?.name : undefined);

  const hidden = plan.additions.items.length - visible.length;

  return (
    <AdditionSection id="own-items" heading="Your own checklist items">
      {visible.length > 0 && (
        <ul className={`${additionBox} divide-y divide-amber-100`}>
          {visible.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              text={item.text}
              meta={
                <>
                  <AdditionMarker />
                  {[groupName(item.stakeholderId), toolName(item.toolId), phaseLabels(item.phases)]
                    .filter(Boolean)
                    .map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                </>
              }
              state={plan.items[item.id]}
              onChange={(patch) => setItem(item.id, patch)}
              onRemove={() => removeAddition('items', item.id)}
            />
          ))}
        </ul>
      )}
      {hidden > 0 && (
        <p className="text-sm text-gray-500">
          {hidden} of your items {hidden === 1 ? 'is' : 'are'} hidden by the phases selected
          above.
        </p>
      )}

      <AdditionForm
        fields={[{ key: 'text', label: 'Item', multiline: true, required: true }]}
        withPhases
        submitLabel="Add item"
        onSubmit={(v, phases) => {
          addAddition('items', {
            text: v.text,
            phases,
            ...(stakeholderId ? { stakeholderId } : {}),
            ...(toolId ? { toolId } : {}),
          });
          setStakeholderId('');
          setToolId('');
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <LinkSelect
            label="Stakeholder group (optional)"
            value={stakeholderId}
            onChange={setStakeholderId}
            options={groupOptions}
          />
          <LinkSelect
            label="Engagement tool (optional)"
            value={toolId}
            onChange={setToolId}
            options={toolOptions}
          />
        </div>
      </AdditionForm>
    </AdditionSection>
  );
}

function LinkSelect({
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
        <option value="">None</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
