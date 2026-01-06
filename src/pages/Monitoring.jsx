import { Zap, DollarSign, Leaf, Gauge, Play, Pause, RotateCcw } from 'lucide-react';
import useRealTimeMonitoring from '../hooks/useRealTimeMonitoring';
import LiveIndicator from '../components/monitoring/LiveIndicator';
import RealTimeKPI from '../components/monitoring/RealTimeKPI';
import AlertPanel from '../components/monitoring/AlertPanel';
import ConsumptionLineChart from '../components/charts/ConsumptionLineChart';
import { formatRelativeTime, formatPower, formatCost, formatCO2, formatPercentage } from '../utils/formatters';

const Monitoring = () => {
  const {
    currentData,
    history,
    alerts,
    isLive,
    lastUpdate,
    toggle,
    clearAlerts,
    getTrend,
  } = useRealTimeMonitoring('global', 3000); // Rafraîchissement toutes les 3 secondes

  // Préparer les données pour le graphique
  const chartData = history.map(item => ({
    timestamp: item.timestamp.toISOString(),
    totalPower: item.instantPower,
    sources: {
      electricity: item.instantPower * 0.7,
      gas: item.instantPower * 0.2 * 0.1,
      solar: item.instantPower * 0.1,
    },
  }));

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Monitoring Temps Réel
            </h1>
            <LiveIndicator 
              isLive={isLive} 
              lastUpdate={lastUpdate ? formatRelativeTime(lastUpdate) : null}
            />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Surveillance en direct de la consommation énergétique
          </p>
        </div>

        {/* Contrôles */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${isLive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
            `}
          >
            {isLive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Reprendre</span>
              </>
            )}
          </button>

          {alerts.length > 0 && (
            <button
              onClick={clearAlerts}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Effacer alertes</span>
            </button>
          )}
        </div>
      </div>

      {/* KPIs Temps Réel */}
      {currentData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RealTimeKPI
            label="Consommation"
            value={currentData.instantPower}
            unit="kW"
            trend={getTrend('instantPower')}
            color="blue"
            icon={Zap}
          />

          <RealTimeKPI
            label="Coût journalier"
            value={currentData.dailyCost}
            unit="€"
            trend={getTrend('dailyCost')}
            color="orange"
            icon={DollarSign}
          />

          <RealTimeKPI
            label="CO₂ journalier"
            value={currentData.dailyCO2}
            unit="kg"
            trend={getTrend('dailyCO2')}
            color="green"
            icon={Leaf}
          />

          <RealTimeKPI
            label="Utilisation"
            value={(currentData.utilizationRate * 100).toFixed(0)}
            unit="%"
            trend={getTrend('utilizationRate')}
            color="purple"
            icon={Gauge}
          />
        </div>
      )}

      {/* Graphique Temps Réel */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Évolution en Temps Réel
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {history.length} points de données • Rafraîchissement toutes les 3s
            </p>
          </div>

          {currentData && (
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Puissance actuelle</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPower(currentData.instantPower)}
              </p>
            </div>
          )}
        </div>

        <ConsumptionLineChart
          data={chartData}
          showSources={false}
          timeFormat="hour"
          loading={false}
        />
      </div>

      {/* Grille inférieure : Alertes + Statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel d'alertes */}
        <AlertPanel alerts={alerts} />

        {/* Statistiques de la session */}
        {currentData && history.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Statistiques de la Session
            </h3>

            <div className="space-y-4">
              {/* Puissance moyenne */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Puissance Moyenne
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPower(
                    history.reduce((sum, item) => sum + item.instantPower, 0) / history.length
                  )}
                </span>
              </div>

              {/* Puissance maximale */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pic de Consommation
                </span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatPower(
                    Math.max(...history.map(item => item.instantPower))
                  )}
                </span>
              </div>

              {/* Puissance minimale */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Consommation Minimale
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatPower(
                    Math.min(...history.map(item => item.instantPower))
                  )}
                </span>
              </div>

              {/* Coût estimé total */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Coût Journalier Estimé
                </span>
                <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCost(currentData.dailyCost)}
                </span>
              </div>

              {/* CO₂ total */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Émissions CO₂ Journalières
                </span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCO2(currentData.dailyCO2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message si pas de données */}
      {!currentData && (
        <div className="card">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Chargement des données temps réel...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;