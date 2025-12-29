import { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowLeftRight, RefreshCw } from 'lucide-react';
import useComparison from '../hooks/useComparison';
import ConsumptionLineChart from '../components/charts/ConsumptionLineChart';
import EnergyMixPieChart from '../components/charts/EnergyMixPieChart';
import { formatPower, formatCost, formatCO2, formatVariation } from '../utils/formatters';

const Comparison = () => {
  const [comparisonType, setComparisonType] = useState('week');
  const [entityId] = useState('site_paris');

  const {
    comparisonData,
    period1Data,
    period2Data,
    energyMix1,
    energyMix2,
    periodLabels,
    loading,
    error,
    refresh,
  } = useComparison(entityId, comparisonType);

  const comparisonTypes = [
    { id: 'day', label: "Aujourd'hui vs Hier" },
    { id: 'week', label: 'Cette semaine vs Semaine dernière' },
    { id: 'month', label: 'Ce mois vs Mois dernier' },
    { id: 'year', label: 'Cette année vs Année dernière' },
  ];

  // Combiner les données des deux périodes pour le graphique
  const combinedData = [
    ...period2Data.map(item => ({
      ...item,
      period: periodLabels.period2,
      isPeriod1: false,
    })),
    ...period1Data.map(item => ({
      ...item,
      period: periodLabels.period1,
      isPeriod1: true,
    })),
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={refresh} className="btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analyse Comparative
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comparaison des consommations entre périodes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {comparisonTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>

          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cartes de Comparaison Principale */}
      {comparisonData && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Consommation */}
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Consommation
              </h3>
              <ArrowLeftRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{periodLabels.period1}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPower(comparisonData.period1.totalConsumption)}h
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {comparisonData.variations.consumption < 0 ? (
                  <TrendingDown className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-lg font-bold ${
                  comparisonData.variations.consumption < 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatVariation(comparisonData.variations.consumption, false).text}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{periodLabels.period2}</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {formatPower(comparisonData.period2.totalConsumption)}h
                </p>
              </div>
            </div>
          </div>

          {/* Coût */}
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Coût
              </h3>
              <ArrowLeftRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{periodLabels.period1}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCost(comparisonData.period1.totalCost)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {comparisonData.variations.cost < 0 ? (
                  <TrendingDown className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-lg font-bold ${
                  comparisonData.variations.cost < 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatVariation(comparisonData.variations.cost, false).text}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{periodLabels.period2}</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {formatCost(comparisonData.period2.totalCost)}
                </p>
              </div>
            </div>
          </div>

          {/* CO₂ */}
          <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Émissions CO₂
              </h3>
              <ArrowLeftRight className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{periodLabels.period1}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCO2(comparisonData.period1.totalCO2)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {comparisonData.variations.co2 < 0 ? (
                  <TrendingDown className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-lg font-bold ${
                  comparisonData.variations.co2 < 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatVariation(comparisonData.variations.co2, false).text}
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{periodLabels.period2}</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {formatCO2(comparisonData.period2.totalCO2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graphiques Comparatifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de consommation comparatif */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Évolution de la Consommation
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {periodLabels.period1} vs {periodLabels.period2}
          </p>
          <ConsumptionLineChart
            data={combinedData}
            showSources={false}
            timeFormat={comparisonType === 'day' ? 'hour' : 'day'}
            loading={loading}
          />
        </div> 

        {/* Mix énergétique période 1 */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Mix Énergétique - {periodLabels.period1}
          </h2>
          <EnergyMixPieChart data={energyMix1} loading={loading} />
        </div>
      </div>

      {/* Mix énergétique période 2 */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Mix Énergétique - {periodLabels.period2}
        </h2>
        <EnergyMixPieChart data={energyMix2} loading={loading} />
      </div>
    </div>
  );
};

export default Comparison;