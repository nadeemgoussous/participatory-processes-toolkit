import type { TabId } from '../../App'

interface TabNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'plan', label: 'Plan' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'tools', label: 'Engagement tools' },
  { id: 'cases', label: 'Case studies' },
]

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="border-b border-gray-200 bg-white print:hidden" aria-label="Sections">
      <div className="container mx-auto flex gap-1 overflow-x-auto px-4">
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? 'border-[var(--color-irena-blue)] text-[var(--color-irena-blue)]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
