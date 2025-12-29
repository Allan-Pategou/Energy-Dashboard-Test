import { useState } from 'react';
import { Zap, DollarSign, Leaf, Gauge, RefreshCw } from 'lucide-react';
import useDashboardData from '../hooks/useDashboardData';
import KPICard from '../components/dashboard/KPICard';
import ConsumptionLineChart from '../components/charts/ConsumptionLineChart';
import PeriodSelector from '../components/filters/PeriodSelector';
import { 
  formatPower, 
  formatCost, 
  formatCO2, 
  formatPercentage,
  formatRelativeTime 
} from '../utils/formatters';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [showSources, setShowSources] = useState(true);
  
  // Calcul du nombre de jours selon la période
  const getDaysFromPeriod = (period) => {
    switch (period) {
      case 'today': return 1;
      case '7d': return 7;
      case '30d': return 30;
      default: return 7;
    }
  };

  const days = getDaysFromPeriod(selectedPeriod);

  // Hook personnalisé pour récupérer les données
  const { 
    realtimeData, 
    historyData, 
    statistics,
    variations,
    utilizationRate,
    loading, 
    error,
    refresh 
  } = useDashboardData('global', days);

  // Gestion du rafraîchissement
  const handleRefresh = () => {
    refresh();
  };

  // Gestion du changement de période
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Affichage erreur
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={handleRefresh} className="btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Principal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vue d'ensemble de la consommation énergétique
            {realtimeData && (
              <span className="ml-2 text-sm">
                • Mis à jour {formatRelativeTime(realtimeData.timestamp)}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PeriodSelector 
            period={selectedPeriod} 
            onChange={handlePeriodChange}
          />
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors disabled:opacity-50"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Consommation Instantanée */}
        <KPICard
          title="Consommation Instantanée"
          value={realtimeData ? formatPower(realtimeData.instantPower) : '-'}
          variation={variations.avgPower}
          comparisonText={`vs ${days === 1 ? 'hier' : `${days} jours préc.`}`}
          icon={Zap}
          iconColor="bg-blue-500"
          loading={loading}
          inverseColors={false}
        />

        {/* KPI 2 : Coût Journalier */}
        <KPICard
          title="Coût Journalier"
          value={realtimeData ? formatCost(realtimeData.dailyCost) : '-'}
          variation={variations.cost}
          comparisonText={`vs ${days === 1 ? 'hier' : 'moyenne'}`}
          icon={DollarSign}
          iconColor="bg-orange-500"
          loading={loading}
          inverseColors={false}
          subtitle={statistics ? `Total période: ${formatCost(statistics.totalCost)}` : null}
        />

        {/* KPI 3 : Émissions CO₂ */}
        <KPICard
          title="Émissions CO₂"
          value={realtimeData ? formatCO2(realtimeData.dailyCO2) : '-'}
          variation={variations.co2}
          comparisonText={`vs ${days === 1 ? 'hier' : 'moyenne'}`}
          icon={Leaf}
          iconColor="bg-green-500"
          loading={loading}
          inverseColors={false}
          subtitle={statistics ? `Total période: ${formatCO2(statistics.totalCO2)}` : null}
        />

        {/* KPI 4 : Taux d'Utilisation */}
        <KPICard
          title="Taux d'Utilisation"
          value={formatPercentage(utilizationRate, true, 0)}
          variation={0} // Pas de variation pour ce KPI
          comparisonText="capacité maximale"
          icon={Gauge}
          iconColor="bg-purple-500"
          loading={loading}
          inverseColors={true}
        />
      </div>

      {/* Graphique de Consommation */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Consommation Énergétique
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {statistics && (
                <>
                  Moyenne: {formatPower(statistics.avgPower)} 
                  {' • '}
                  Pic: {formatPower(statistics.maxPower)}
                  {' • '}
                  {historyData.length} points de données
                </>
              )}
            </p>
          </div>

          {/* Toggle sources */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-sources"
              checked={showSources}
              onChange={(e) => setShowSources(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label 
              htmlFor="show-sources" 
              className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Afficher les sources
            </label>
          </div>
        </div>

        <ConsumptionLineChart
          data={historyData}
          showSources={showSources}
          timeFormat={days === 1 ? 'hour' : 'day'}
          loading={loading}
        />
      </div>

      {/* Statistiques détaillées */}
      {statistics && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Consommation Totale */}
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-l-4 border-blue-500">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Consommation Totale
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPower(statistics.totalConsumption)}h
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Sur {days} jour{days > 1 ? 's' : ''}
            </p>
          </div>

          {/* Puissance Min/Max */}
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-l-4 border-purple-500">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Plage de Puissance
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatPower(statistics.minPower)}
              </p>
              <span className="text-gray-500 dark:text-gray-400">→</span>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatPower(statistics.maxPower)}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Min → Max
            </p>
          </div>

          {/* Coût Moyen */}
          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-4 border-orange-500">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Coût Moyen Journalier
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCost(statistics.totalCost / days)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Projection mensuelle: {formatCost((statistics.totalCost / days) * 30)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;