import { useState } from 'react';
import type { StakeholderProfile } from '../../types/stakeholder';
import { getCaseStudiesForStakeholder } from '../../data/case-studies';

interface RelatedCaseStudiesProps {
  stakeholder: StakeholderProfile;
  maxDisplay?: number; // Default 3
}

export default function RelatedCaseStudies({ stakeholder, maxDisplay = 3 }: RelatedCaseStudiesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const relevantCaseStudies = getCaseStudiesForStakeholder(stakeholder.id).slice(0, maxDisplay);

  if (relevantCaseStudies.length === 0) {
    return null; // Don't show section if no relevant case studies
  }

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-6 h-6 text-irena-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">
          Real-world examples: how countries engaged {stakeholder.name}
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Learn from {relevantCaseStudies.length} real implementation{relevantCaseStudies.length > 1 ? 's' : ''} that successfully engaged this stakeholder group.
      </p>

      <div className="space-y-3">
        {relevantCaseStudies.map((caseStudy) => (
          <div
            key={caseStudy.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Card Header - Always Visible */}
            <button
              onClick={() => toggleExpanded(caseStudy.id)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{caseStudy.flagEmoji}</span>
                  <h4 className="font-semibold text-gray-800">{caseStudy.country}</h4>
                  {caseStudy.resources.budgetLevel !== 'not-specified' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      caseStudy.resources.budgetLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                      caseStudy.resources.budgetLevel === 'medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {caseStudy.resources.budgetLevel} budget
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 font-medium">{caseStudy.title}</p>
                <p className="text-xs text-gray-500 mt-1">{caseStudy.highlight}</p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {caseStudy.engagementMethods.slice(0, 3).map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-gray-200"
                    >
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
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
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expandedId === caseStudy.id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded Details */}
            {expandedId === caseStudy.id && (
              <div className="px-4 py-4 bg-white border-t border-gray-100">
                {/* Objectives */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-1">Objectives</h5>
                  <p className="text-sm text-gray-600">{caseStudy.objectives}</p>
                </div>

                {/* Key Outcomes */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Key outcomes</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {caseStudy.keyOutcomes.map((outcome, idx) => (
                      <li key={idx}>{outcome}</li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                {(caseStudy.resources.budget || caseStudy.resources.staff || caseStudy.resources.timeline) && (
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Resources required</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
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
                )}

                {/* Lessons Learnt */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Key lessons</h5>
                  <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-600">
                    {caseStudy.lessonsLearnt.map((lesson, idx) => (
                      <li key={idx} className="pl-2">{lesson}</li>
                    ))}
                  </ol>
                </div>

                {/* Transferable Elements */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Transferable to your context</h5>
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

                {/* Link to Full Toolkit Section */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    <strong>Source:</strong> IRENA Participatory Processes Toolkit, Section {caseStudy.toolkitSection}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Browse More Link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Want to see all {relevantCaseStudies.length > maxDisplay ? 'case studies' : 'examples'}?{' '}
          <button
            onClick={() => {/* Navigate to Communicate tab */}}
            className="text-irena-blue hover:underline font-medium"
          >
            Browse the full case study library →
          </button>
        </p>
      </div>
    </div>
  );
}
