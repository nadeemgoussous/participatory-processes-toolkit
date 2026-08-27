import { useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import TabNavigation from './components/layout/TabNavigation'
import PlanTab from './components/plan/PlanTab'
import WhyTab from './components/why/WhyTab'
import StakeholdersTab from './components/stakeholders/StakeholdersTab'
import ToolsTab from './components/tools/ToolsTab'
import CasesTab from './components/cases/CasesTab'
import ResourcesTab from './components/resources/ResourcesTab'
import ErrorBoundary from './components/common/ErrorBoundary'
import { PlanProvider } from './context/PlanContext'

export type TabId = 'plan' | 'why' | 'stakeholders' | 'tools' | 'cases' | 'resources'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('plan')

  return (
    <ErrorBoundary>
      <PlanProvider>
        <div className="flex min-h-screen flex-col bg-gray-50">
          <ErrorBoundary>
            <Header />
          </ErrorBoundary>

          <ErrorBoundary>
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </ErrorBoundary>

          <main className="container mx-auto flex-1 px-4 py-8">
            <ErrorBoundary>
              {activeTab === 'plan' && <PlanTab />}
              {activeTab === 'why' && <WhyTab />}
              {activeTab === 'stakeholders' && <StakeholdersTab />}
              {activeTab === 'tools' && <ToolsTab />}
              {activeTab === 'cases' && <CasesTab />}
              {activeTab === 'resources' && <ResourcesTab />}
            </ErrorBoundary>
          </main>

          <ErrorBoundary>
            <Footer />
          </ErrorBoundary>
        </div>
      </PlanProvider>
    </ErrorBoundary>
  )
}

export default App
