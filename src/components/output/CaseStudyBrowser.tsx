import { useState, useMemo } from 'react';
import { caseStudies } from '../../data/case-studies';
import type { EngagementMethod, Region, BudgetLevel } from '../../types/case-study';
import { stakeholderProfiles } from '../../data/stakeholder-profiles';

interface CaseStudyBrowserProps {
  initialStakeholder?: string; // Pre-filter by stakeholder if coming from contextual link
}

export default function CaseStudyBrowser({ initialStakeholder }: CaseStudyBrowserProps) {
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>(initialStakeholder || 'all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract unique methods and regions from case studies
  const allMethods = useMemo(() => {
    const methods = new Set<EngagementMethod>();
    caseStudies.forEach(cs => cs.engagementMethods.forEach(m => methods.add(m)));
    return Array.from(methods).sort();
  }, []);

  const allRegions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Global'];
  const budgetLevels: BudgetLevel[] = ['low', 'medium', 'high'];

  // Filter case studies
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter(cs => {
      // Filter by stakeholder
      if (selectedStakeholder !== 'all' && !cs.stakeholdersEngaged.includes(selectedStakeholder)) {
        return false;
      }
      // Filter by method
      if (selectedMethod !== 'all' && !cs.engagementMethods.includes(selectedMethod as EngagementMethod)) {
        return false;
      }
      // Filter by region
      if (selectedRegion !== 'all' && cs.region !== selectedRegion) {
        return false;
      }
      // Filter by budget
      if (selectedBudget !== 'all' && cs.resources.budgetLevel !== selectedBudget) {
        return false;
      }
      return true;
    });
  }, [selectedStakeholder, selectedMethod, selectedRegion, selectedBudget]);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const resetFilters = () => {
    setSelectedStakeholder('all');
    setSelectedMethod('all');
    setSelectedRegion('all');
    setSelectedBudget('all');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📚 Case Study Library
        </h2>
        <p className="text-gray-600">
          Explore 13 real-world examples from the IRENA Participatory Processes Toolkit.
          Learn how countries and organizations successfully engaged stakeholders in energy planning.
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Case Studies</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stakeholder Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stakeholder Group
            </label>
            <select
              value={selectedStakeholder}
              onChange={(e) => setSelectedStakeholder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-irena-blue focus:border-transparent text-sm"
            >
              <option value="all">All Stakeholders</option>
              {stakeholderProfiles.map(sp => (
                <option key={sp.id} value={sp.id}>{sp.name}</option>
              ))}
            </select>
          </div>

          {/* Method Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Engagement Method
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-irena-blue focus:border-transparent text-sm"
            >
              <option value="all">All Methods</option>
              {allMethods.map(method => (
                <option key={method} value={method}>
                  {method.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-irena-blue focus:border-transparent text-sm"
            >
              <option value="all">All Regions</option>
              {allRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Budget Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Level
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-irena-blue focus:border-transparent text-sm"
            >
              <option value="all">All Budgets</option>
              {budgetLevels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Button */}
        {(selectedStakeholder !== 'all' || selectedMethod !== 'all' || selectedRegion !== 'all' || selectedBudget !== 'all') && (
          <div className="mt-4">
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing <strong>{filteredCaseStudies.length}</strong> of <strong>{caseStudies.length}</strong> case studies
        </div>
      </div>

      {/* Case Study Cards */}
      {filteredCaseStudies.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No case studies match your filters.</p>
          <button
            onClick={resetFilters}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCaseStudies.map((caseStudy) => (
            <div
              key={caseStudy.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header - Always Visible */}
              <button
                onClick={() => toggleExpanded(caseStudy.id)}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{caseStudy.flagEmoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{caseStudy.country}</h3>
                      {caseStudy.region && (
                        <span className="text-xs text-gray-500">{caseStudy.region}</span>
                      )}
                    </div>
                    {caseStudy.resources.budgetLevel !== 'not-specified' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        caseStudy.resources.budgetLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                        caseStudy.resources.budgetLevel === 'medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {caseStudy.resources.budgetLevel}
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{caseStudy.title}</h4>
                  {caseStudy.subtitle && (
                    <p className="text-sm text-gray-600 mb-2">{caseStudy.subtitle}</p>
                  )}

                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Context:</strong> {caseStudy.planningContext}
                  </p>

                  {/* Quick Metrics */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    {caseStudy.stakeholdersEngaged.length > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{caseStudy.stakeholdersEngaged.length} stakeholder group{caseStudy.stakeholdersEngaged.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {caseStudy.engagementMethods.length > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>{caseStudy.engagementMethods.length} method{caseStudy.engagementMethods.length > 1 ? 's' : ''} used</span>
                      </div>
                    )}
                  </div>

                  {/* Top 3 Methods Preview */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {caseStudy.engagementMethods.slice(0, 3).map((method) => (
                      <span
                        key={method}
                        className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-gray-300"
                      >
                        {method.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {caseStudy.engagementMethods.length > 3 && (
                      <span className="text-xs text-gray-500">+{caseStudy.engagementMethods.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Expand/Collapse Icon */}
                <svg
                  className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform ${expandedId === caseStudy.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Details (same as RelatedCaseStudies) */}
              {expandedId === caseStudy.id && (
                <div className="px-6 py-5 bg-white border-t border-gray-200">
                  {/* Governance */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-1">Governance</h5>
                    <p className="text-sm text-gray-600">{caseStudy.governance}</p>
                  </div>

                  {/* Scope */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-1">Scope</h5>
                    <p className="text-sm text-gray-600">{caseStudy.scope}</p>
                  </div>

                  {/* Objectives */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-1">Objectives</h5>
                    <p className="text-sm text-gray-600">{caseStudy.objectives}</p>
                  </div>

                  {/* Stakeholders Engaged */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Stakeholders Engaged</h5>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.stakeholdersEngaged.map(sId => {
                        const stakeholder = stakeholderProfiles.find(sp => sp.id === sId);
                        return stakeholder ? (
                          <span
                            key={sId}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border"
                            style={{ borderColor: stakeholder.color, color: stakeholder.color }}
                          >
                            {stakeholder.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Engagement Methods */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Engagement Methods Used</h5>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.engagementMethods.map(method => (
                        <span
                          key={method}
                          className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-200"
                        >
                          {method.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Outcomes */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Outcomes</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {caseStudy.keyOutcomes.map((outcome, idx) => (
                        <li key={idx}>{outcome}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Resources Required</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      {caseStudy.resources.budget && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400">💰</span>
                          <span><strong>Budget:</strong> {caseStudy.resources.budget}</span>
                        </div>
                      )}
                      {caseStudy.resources.staff && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400">👥</span>
                          <span><strong>Staff:</strong> {caseStudy.resources.staff}</span>
                        </div>
                      )}
                      {caseStudy.resources.timeline && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400">📅</span>
                          <span><strong>Timeline:</strong> {caseStudy.resources.timeline}</span>
                        </div>
                      )}
                      {caseStudy.resources.participants && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400">🎯</span>
                          <span><strong>Participants:</strong> {caseStudy.resources.participants}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Highlight */}
                  <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h5 className="text-sm font-semibold text-yellow-900 mb-1">💡 Highlight</h5>
                    <p className="text-sm text-yellow-800">{caseStudy.highlight}</p>
                  </div>

                  {/* Lessons Learnt */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Lessons</h5>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                      {caseStudy.lessonsLearnt.map((lesson, idx) => (
                        <li key={idx} className="pl-2">{lesson}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Transferable Elements */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Transferable to Your Context</h5>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.transferableElements.map((element, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200"
                        >
                          ✓ {element}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Link to Toolkit */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      <strong>Source:</strong> IRENA Participatory Processes Toolkit, Section {caseStudy.toolkitSection} • {caseStudy.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
