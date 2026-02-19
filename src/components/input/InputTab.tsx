import { useState } from 'react';
import { useScenario } from '../../context/ScenarioContext';
import { ScenarioInput } from '../../types/scenario';
import QuickEntryForm from './QuickEntryForm';
import ScenarioPreview from './ScenarioPreview';
import CSVUploader from './CSVUploader';

type InputMethod = 'example' | 'paste' | 'quick' | 'csv' | null;

interface InputTabProps {
  onProceedToDialogue?: () => void;
}

export default function InputTab({ onProceedToDialogue }: InputTabProps) {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { scenario, loadScenario, clearScenario } = useScenario();

  const handleLoadExample = async () => {
    setLoading(true);
    setError(null);
    setSelectedMethod(null); // Clear any selected method to show preview
    try {
      // Load the example baseline scenario (bundled with the app - works offline)
      const response = await fetch(`${import.meta.env.BASE_URL}sample-data/scenarioland-baseline.json`);
      if (!response.ok) {
        throw new Error('Failed to load example scenario');
      }
      const data: ScenarioInput = await response.json();
      loadScenario(data);
      // Don't set selectedMethod - let the preview show
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load example');
    } finally {
      setLoading(false);
    }
  };

  const handlePasteJSON = () => {
    setSelectedMethod('paste');
    setError(null);
  };

  const handleQuickEntry = () => {
    setSelectedMethod('quick');
    setError(null);
  };

  const handleCSVUpload = () => {
    setSelectedMethod('csv');
    setError(null);
  };

  const handleLoadDifferent = () => {
    clearScenario();
    setSelectedMethod(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-irena-blue)' }}>
          Import Your Scenario
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          Choose your preferred method to input scenario data.
        </p>
        <p className="text-sm text-gray-600">
          Target: Complete data input in under 5 minutes
        </p>
      </div>

      {/* Four Input Options */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* Option 1: Load Example — recommended path */}
        <button
          onClick={handleLoadExample}
          disabled={loading}
          className="text-left p-5 rounded-lg border-2 bg-white transition-all duration-200 hover:border-gray-400 hover:shadow-sm"
          style={{ borderColor: scenario && !selectedMethod && !loading ? 'var(--color-irena-blue)' : undefined }}
          data-testid="load-example-button"
        >
          <h3 className="text-lg font-semibold mb-1">Load Example</h3>
          <p className="text-gray-600 text-sm">
            Load an example scenario to explore the tool's features. Works offline and loads instantly.
          </p>
        </button>

        {/* Option 2: Paste from Template */}
        <button
          onClick={handlePasteJSON}
          disabled={loading}
          className="text-left p-5 rounded-lg border-2 bg-white transition-all duration-200 hover:border-gray-400 hover:shadow-sm"
          style={{ borderColor: selectedMethod === 'paste' ? 'var(--color-irena-blue)' : undefined }}
          data-testid="paste-json-button"
        >
          <h3 className="text-lg font-semibold mb-1">Paste from Template</h3>
          <p className="text-gray-600 text-sm">
            Paste JSON output from the Excel template for full model data import.
          </p>
        </button>

        {/* Option 3: Quick Entry */}
        <button
          onClick={handleQuickEntry}
          disabled={loading}
          className="text-left p-5 rounded-lg border-2 bg-white transition-all duration-200 hover:border-gray-400 hover:shadow-sm"
          style={{ borderColor: selectedMethod === 'quick' ? 'var(--color-irena-blue)' : undefined }}
          data-testid="quick-entry-button"
        >
          <h3 className="text-lg font-semibold mb-1">Quick Entry</h3>
          <p className="text-gray-600 text-sm">
            Enter 7–10 essential metrics manually with built-in validation.
          </p>
        </button>

        {/* Option 4: Upload CSV */}
        <button
          onClick={handleCSVUpload}
          disabled={loading}
          className="text-left p-5 rounded-lg border-2 bg-white transition-all duration-200 hover:border-gray-400 hover:shadow-sm"
          style={{ borderColor: selectedMethod === 'csv' ? 'var(--color-irena-blue)' : undefined }}
          data-testid="csv-upload-button"
        >
          <h3 className="text-lg font-semibold mb-1">Upload CSV</h3>
          <p className="text-gray-600 text-sm">
            Import from SPLAT, MESSAGE, or other models with auto-detect and technology mapping.
          </p>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6" data-testid="error-message">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8" data-testid="loading-indicator">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Loading scenario...</p>
        </div>
      )}

      {/* Scenario Preview (if loaded and no method selected) */}
      {scenario && !loading && !selectedMethod && (
        <ScenarioPreview
          scenario={scenario}
          onProceed={onProceedToDialogue}
          onLoadDifferent={handleLoadDifferent}
        />
      )}

      {/* Selected Method Content (Paste/Quick Entry) */}
      {selectedMethod === 'paste' && (
        <div className="text-center py-8" data-testid="paste-placeholder">
          <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-irena-blue)' }}>
            Paste JSON from Template
          </h3>
          <p className="text-gray-600 mb-4">
            Coming soon: JSON paste functionality
          </p>
          <button
            onClick={() => setSelectedMethod(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to options
          </button>
        </div>
      )}

      {selectedMethod === 'quick' && (
        <QuickEntryForm
          onCancel={() => setSelectedMethod(null)}
          onSubmit={() => setSelectedMethod(null)}
        />
      )}

      {selectedMethod === 'csv' && (
        <CSVUploader
          onCancel={() => setSelectedMethod(null)}
          onSuccess={() => setSelectedMethod(null)}
        />
      )}
    </div>
  );
}
