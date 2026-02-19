import type { StakeholderProfile } from '../../types/stakeholder';
import type { StakeholderResponse } from '../../types/response';
import { StakeholderIcon } from '../stakeholder/StakeholderIcon';
import RelatedCaseStudies from '../output/RelatedCaseStudies';

interface CompareViewProps {
  stakeholder: StakeholderProfile;
  userPrediction: string;
  stakeholderResponse: StakeholderResponse;
  streamingText?: string;
  isStreaming?: boolean;
  onTryAnother: () => void;
  onExportBrief?: () => void;
  onExplore?: () => void;
}

export default function CompareView({
  stakeholder,
  userPrediction,
  stakeholderResponse,
  streamingText = '',
  isStreaming = false,
  onTryAnother,
  onExportBrief,
  onExplore
}: CompareViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <StakeholderIcon stakeholder={stakeholder} size="large" />
          <h2 className="text-3xl font-bold text-gray-800">
            {stakeholder.name}
          </h2>
        </div>
        <p className="text-gray-600">
          Compare your prediction with the simulated response
        </p>
      </div>

      {/* User's Prediction Box */}
      <div className="mb-6" style={{ borderLeftColor: 'var(--color-irena-blue)', borderLeftWidth: '4px', paddingLeft: '1.5rem' }}>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Your Prediction
        </h3>
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {userPrediction}
        </p>
      </div>

      {/* Simulated Response Box */}
      <div
        className="mb-6"
        style={{ borderLeftColor: stakeholder.color, borderLeftWidth: '4px', paddingLeft: '1.5rem' }}
      >
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Simulated Response
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {stakeholderResponse.generationType === 'ai-enhanced'
              ? 'AI-enhanced response'
              : 'Rule-based response'}
          </p>
        </div>

        {/* Initial Reaction */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span
              className="w-1 h-5 rounded"
              style={{ backgroundColor: stakeholder.color }}
            ></span>
            Initial Reaction
            {isStreaming && (
              <span className="text-xs text-gray-500 ml-2 flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            )}
          </h4>
          <div className="text-gray-700 leading-relaxed">
            {isStreaming && streamingText ? (
              // Show streaming text with typing cursor
              <span>
                {streamingText}
                <span className="inline-block w-2 h-5 ml-1 bg-irena-blue animate-pulse"></span>
              </span>
            ) : (
              // Show final response
              <p>{stakeholderResponse.initialReaction}</p>
            )}
          </div>
        </div>

        {/* Only show these sections when not streaming */}
        {!isStreaming && (
          <>
            {/* Appreciation */}
            {stakeholderResponse.appreciation.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  What They Appreciate
                </h4>
                <ul className="space-y-2">
                  {stakeholderResponse.appreciation.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">–</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Concerns */}
            {stakeholderResponse.concerns.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Their Concerns
                </h4>
                <ul className="space-y-3">
                  {stakeholderResponse.concerns.map((concern, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span
                        className={`mt-1 ${
                          concern.severity === 'high' ? 'text-red-500' :
                          concern.severity === 'medium' ? 'text-amber-500' :
                          'text-yellow-500'
                        }`}
                      >
                        ⚠
                      </span>
                      <div>
                        <p className="text-gray-800 font-medium">{concern.text}</p>
                        <p className="text-sm text-gray-600 mt-1">{concern.explanation}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Questions */}
            {stakeholderResponse.questions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Questions They Would Ask
                </h4>
                <ul className="space-y-2">
                  {stakeholderResponse.questions.map((question, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">–</span>
                      <span className="text-gray-700 italic">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Engagement Advice */}
            {stakeholderResponse.engagementAdvice.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Engagement Tips
                </h4>
                <ul className="space-y-2">
                  {stakeholderResponse.engagementAdvice.map((advice, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">→</span>
                      <span className="text-gray-700">{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Only show reflection and actions when not streaming */}
      {!isStreaming && (
        <>
          {/* Reflection Prompt */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Reflection: How did your prediction compare?
            </h3>
            <div className="text-gray-700 space-y-2">
              <p className="text-sm">Consider these questions:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>What did you predict correctly?</li>
                <li>What concerns or priorities did you miss?</li>
                <li>How might this influence your real stakeholder engagement strategy?</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            {/* Primary CTA: Explore Impacts */}
            {onExplore && (
              <button
                onClick={onExplore}
                className="w-full px-8 py-4 bg-irena-blue text-white rounded-lg hover:bg-irena-blue-medium transition-colors font-semibold text-lg shadow-md"
              >
                Explore Impacts & Adjust Scenario →
              </button>
            )}

            {/* Secondary actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onTryAnother}
                className="btn-secondary px-6 py-2 text-sm"
              >
                ← Try Another Stakeholder
              </button>
              {onExportBrief && (
                <button
                  onClick={onExportBrief}
                  className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm"
                >
                  Export Brief →
                </button>
              )}
            </div>

            {/* Helpful hint */}
            <p className="text-sm text-center text-gray-600 italic">
              💡 Now that you know their concerns, explore how adjustments affect stakeholder sentiment
            </p>
          </div>
        </>
      )}

      {/* Related Case Studies - Show contextually after response */}
      {!isStreaming && <RelatedCaseStudies stakeholder={stakeholder} maxDisplay={3} />}

      {/* Learning Note */}
      <div className="mt-6 text-center text-sm text-gray-500 italic">
        💡 This is a learning exercise. Real stakeholder responses will vary based on context,
        relationships, and many other factors not captured in this simulation.
      </div>
    </div>
  );
}
