import { useState, useRef, useCallback } from 'react';
import { ScenarioInput } from '../../types/scenario';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer
} from 'recharts';
import { smartFormatMoney } from '../../utils/unit-conversions';
import { Tooltip } from '../common/Tooltip';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

interface ScenarioPreviewProps {
  scenario: ScenarioInput;
  onProceed?: () => void;
  onLoadDifferent?: () => void;
}

type ChartView = 'capacity-bar' | 'capacity-area' | 'generation-pie' | 'emissions-line' | 're-trajectory';

const CHART_OPTIONS: { id: ChartView; label: string }[] = [
  { id: 'capacity-bar', label: 'Capacity Mix' },
  { id: 'capacity-area', label: 'Capacity Trend' },
  { id: 'generation-pie', label: 'Generation Split' },
  { id: 'emissions-line', label: 'Emissions Path' },
  { id: 're-trajectory', label: 'RE Trajectory' },
];

const TECH_COLORS = {
  Renewables: '#22c55e',
  Fossil: '#64748b',
  Storage: '#06b6d4',
  Other: '#f97316',
};

export default function ScenarioPreview({ scenario, onProceed, onLoadDifferent }: ScenarioPreviewProps) {
  const [chartView, setChartView] = useState<ChartView>('capacity-bar');
  const chartRef = useRef<HTMLDivElement>(null);

  const lastMilestone = scenario.milestones[scenario.milestones.length - 1];
  const firstMilestone = scenario.milestones[0];
  const totalInvestment = lastMilestone.investment.cumulative;

  const calculateEmissionsReduction = (): number => {
    if (scenario.milestones.length < 2) return 0;
    const firstEmissions = firstMilestone.emissions.total;
    const lastEmissions = lastMilestone.emissions.total;
    return firstEmissions > 0 ? ((firstEmissions - lastEmissions) / firstEmissions) * 100 : 0;
  };

  const emissionsReduction = calculateEmissionsReduction();

  // Data prep for charts
  const capacityData = scenario.milestones.map(m => ({
    year: m.year.toString(),
    Renewables: m.capacity.total.renewables,
    Fossil: m.capacity.total.fossil,
    Storage: m.capacity.total.storage || 0,
    Other: m.capacity.total.other || 0,
  }));

  const emissionsData = scenario.milestones.map(m => ({
    year: m.year.toString(),
    emissions: m.emissions.total,
  }));

  const reData = scenario.milestones.map(m => ({
    year: m.year.toString(),
    reShare: m.reShare,
  }));

  // Generation pie for the latest milestone
  const genPieData = [
    { name: 'Renewables', value: lastMilestone.generation.output.renewables, color: TECH_COLORS.Renewables },
    { name: 'Fossil', value: lastMilestone.generation.output.fossil, color: TECH_COLORS.Fossil },
    ...(lastMilestone.generation.output.other ? [{ name: 'Other', value: lastMilestone.generation.output.other, color: TECH_COLORS.Other }] : []),
  ].filter(d => d.value > 0);

  const latestRE = lastMilestone.reShare;
  const peakDemand = lastMilestone.peakDemand;

  const chartLabel = CHART_OPTIONS.find(o => o.id === chartView)?.label ?? 'Chart';

  const getExportData = useCallback((): Record<string, unknown>[] => {
    switch (chartView) {
      case 'capacity-bar':
      case 'capacity-area':
        return capacityData;
      case 'generation-pie':
        return genPieData.map(d => ({ Name: d.name, Value: d.value }));
      case 'emissions-line':
        return emissionsData;
      case 're-trajectory':
        return reData;
    }
  }, [chartView, capacityData, genPieData, emissionsData, reData]);

  const handleExportImage = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, { backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `${scenario.metadata.scenarioName}-${chartLabel.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      console.error('Image export failed:', err);
    }
  }, [chartLabel, scenario.metadata.scenarioName]);

  const handleExportExcel = useCallback(() => {
    try {
      const data = getExportData();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, chartLabel);
      XLSX.writeFile(wb, `${scenario.metadata.scenarioName}-${chartLabel.replace(/\s+/g, '-').toLowerCase()}.xlsx`);
    } catch (err) {
      console.error('Excel export failed:', err);
    }
  }, [chartLabel, getExportData, scenario.metadata.scenarioName]);

  const renderChart = () => {
    switch (chartView) {
      case 'capacity-bar':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={capacityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 13 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: `Capacity (${firstMilestone.capacity.unit})`, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
              />
              <ChartTooltip />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="Renewables" stackId="a" fill={TECH_COLORS.Renewables} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Fossil" stackId="a" fill={TECH_COLORS.Fossil} />
              <Bar dataKey="Storage" stackId="a" fill={TECH_COLORS.Storage} />
              <Bar dataKey="Other" stackId="a" fill={TECH_COLORS.Other} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'capacity-area':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={capacityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 13 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: `Capacity (${firstMilestone.capacity.unit})`, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
              />
              <ChartTooltip />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Area type="monotone" dataKey="Renewables" stackId="1" stroke={TECH_COLORS.Renewables} fill={TECH_COLORS.Renewables} fillOpacity={0.6} />
              <Area type="monotone" dataKey="Fossil" stackId="1" stroke={TECH_COLORS.Fossil} fill={TECH_COLORS.Fossil} fillOpacity={0.6} />
              <Area type="monotone" dataKey="Storage" stackId="1" stroke={TECH_COLORS.Storage} fill={TECH_COLORS.Storage} fillOpacity={0.6} />
              <Area type="monotone" dataKey="Other" stackId="1" stroke={TECH_COLORS.Other} fill={TECH_COLORS.Other} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'generation-pie':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={genPieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {genPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip formatter={(value: number) => `${value.toLocaleString()} ${lastMilestone.generation.unit}`} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'emissions-line':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={emissionsData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 13 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: `Emissions (${firstMilestone.emissions.unit})`, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
              />
              <ChartTooltip />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 5, fill: '#ef4444' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 're-trajectory':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={reData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="reGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 13 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                label={{ value: 'RE Share (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
              />
              <ChartTooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Area
                type="monotone"
                dataKey="reShare"
                stroke="#22c55e"
                strokeWidth={3}
                fill="url(#reGradient)"
                dot={{ r: 5, fill: '#22c55e' }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div data-testid="scenario-preview">
      {/* Header with scenario identity */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-1">
          <h3 className="text-2xl font-bold" style={{ color: 'var(--color-irena-blue)' }}>
            {scenario.metadata.scenarioName}
          </h3>
          <span className="text-sm text-gray-500 font-medium">
            {scenario.metadata.country} &middot; {scenario.metadata.modelVersion}
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          {scenario.milestones.length} milestone years: {scenario.milestones.map(m => m.year).join(', ')}
        </p>
      </div>

      {/* Hero KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* RE Share (latest) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Tooltip content="renewable_share">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">RE Share {lastMilestone.year}</span>
          </Tooltip>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900" data-testid={`preview-re-${lastMilestone.year}`}>
              {latestRE.toFixed(1)}
            </span>
            <span className="text-lg text-gray-500">%</span>
          </div>
          {scenario.milestones.length > 1 && (
            <div className="mt-2 text-xs text-gray-400">
              From {firstMilestone.reShare.toFixed(0)}% in {firstMilestone.year}
            </div>
          )}
        </div>

        {/* Total Investment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Tooltip content="investment">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Investment</span>
          </Tooltip>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-900" data-testid="preview-investment">
              {smartFormatMoney(totalInvestment)}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Cumulative to {lastMilestone.year}
          </div>
        </div>

        {/* Emissions Reduction */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Tooltip content="emissions_reduction">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Emissions Change</span>
          </Tooltip>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${emissionsReduction > 0 ? 'text-green-600' : 'text-gray-900'}`} data-testid="preview-emissions">
              {emissionsReduction > 0 ? `−${emissionsReduction.toFixed(0)}` : 'N/A'}
            </span>
            {emissionsReduction > 0 && <span className="text-lg text-green-600">%</span>}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {firstMilestone.year} → {lastMilestone.year}
          </div>
        </div>

        {/* Peak Demand */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Peak Demand {lastMilestone.year}</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {peakDemand.value.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">{peakDemand.unit}</span>
          </div>
          {scenario.milestones.length > 1 && (
            <div className="mt-2 text-xs text-gray-400">
              From {firstMilestone.peakDemand.value.toLocaleString()} {firstMilestone.peakDemand.unit}
            </div>
          )}
        </div>
      </div>

      {/* RE Share timeline (if more than one milestone) */}
      {scenario.milestones.length > 1 && (
        <div className="flex items-center gap-2 mb-8 px-1">
          {scenario.milestones.map((m, i) => (
            <div key={m.year} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-gray-500 mb-1">{m.year}</span>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width: `${m.reShare}%`,
                      backgroundColor: m.reShare > 50 ? '#22c55e' : '#f59e0b',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold mt-1" style={{ color: m.reShare > 50 ? '#16a34a' : '#d97706' }}>
                  {m.reShare.toFixed(0)}%
                </span>
              </div>
              {i < scenario.milestones.length - 1 && (
                <span className="text-gray-300 text-lg mt-3">→</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chart Section with selector */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold" style={{ color: 'var(--color-irena-blue)' }}>
            Visualisation
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {CHART_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setChartView(opt.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    chartView === opt.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleExportImage}
                className="px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all"
                title="Export chart as image"
                data-testid="export-image-btn"
              >
                JPG
              </button>
              <button
                onClick={handleExportExcel}
                className="px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all"
                title="Export chart data as Excel"
                data-testid="export-excel-btn"
              >
                Excel
              </button>
            </div>
          </div>
        </div>

        <div ref={chartRef} className="bg-gray-50 rounded-xl p-5 border border-gray-100" data-testid="capacity-mix-chart">
          {renderChart()}
          {chartView === 'generation-pie' && (
            <p className="text-xs text-gray-400 text-center mt-2">
              Generation split for {lastMilestone.year} ({lastMilestone.generation.unit})
            </p>
          )}
        </div>
      </div>

      {/* Detailed Tech Info (if available) */}
      {scenario.detailedTech && (
        <p className="text-xs text-gray-500 mb-6">
          <strong>Detailed technology data available:</strong>{' '}
          {Object.keys(scenario.detailedTech).join(', ')}
        </p>
      )}

      {/* Action Area */}
      <div className="section-divider flex items-center justify-between">
        {onLoadDifferent && (
          <button
            onClick={onLoadDifferent}
            className="btn-secondary flex-shrink-0"
            data-testid="load-different-button"
          >
            ← Load Different Scenario
          </button>
        )}

        {onProceed && (
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Ready to explore stakeholder responses.
            </p>
            <button
              onClick={onProceed}
              className="btn-primary whitespace-nowrap"
              data-testid="proceed-button"
            >
              Proceed to Dialogue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
