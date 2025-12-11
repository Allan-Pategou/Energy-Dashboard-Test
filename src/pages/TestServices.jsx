import { useState, useEffect } from 'react';
import { 
  fetchSites, 
  fetchRealtimeData,
  fetchConsumptionHistory,
  fetchEnergyMix,
  fetchStatistics 
} from '../services/energyService';
import { 
  formatPower, 
  formatCost, 
  formatCO2, 
  formatPercentage,
  formatDate 
} from '../utils/formatters';

const TestServices = () => {
  const [sites, setSites] = useState([]);
  const [realtimeData, setRealtimeData] = useState(null);
  const [stats, setStats] = useState(null);
  const [energyMix, setEnergyMix] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Récupérer les sites
      const sitesResult = await fetchSites();
      if (sitesResult.success) {
        setSites(sitesResult.data);
      }

      // Récupérer données temps réel
      const realtimeResult = await fetchRealtimeData();
      if (realtimeResult.success) {
        setRealtimeData(realtimeResult.data);
      }

      // Récupérer statistiques (7 derniers jours)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const statsResult = await fetchStatistics('site_paris', startDate, endDate);
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Récupérer mix énergétique
      const mixResult = await fetchEnergyMix('site_paris', startDate, endDate);
      if (mixResult.success) {
        setEnergyMix(mixResult.data);
      }

    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Test des Services & Données Mock
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vérification du bon fonctionnement des services et utilitaires
        </p>
      </div>

      {/* Section Sites */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📍 Sites Disponibles ({sites.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sites.map(site => (
            <div 
              key={site.id} 
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {site.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {site.location.city}, {site.location.country}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {site.buildings.length} bâtiments · {site.area} m²
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section Temps Réel */}
      {realtimeData && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            ⚡ Données Temps Réel - Global
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Puissance</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatPower(realtimeData.global.instantPower)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Consommation Jour</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPower(realtimeData.global.dailyConsumption)}h
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coût Jour</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCost(realtimeData.global.dailyCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">CO₂ Jour</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCO2(realtimeData.global.dailyCO2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section Statistiques */}
      {stats && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Statistiques - Site Paris (7 derniers jours)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Consommation Totale</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatPower(stats.totalConsumption)}h
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coût Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCost(stats.totalCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">CO₂ Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCO2(stats.totalCO2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Puissance Moyenne</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatPower(stats.avgPower)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Puissance Max</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {formatPower(stats.maxPower)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Puissance Min</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatPower(stats.minPower)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section Mix Énergétique */}
      {energyMix.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🔋 Mix Énergétique - Site Paris (7 derniers jours)
          </h2>
          <div className="space-y-3">
            {energyMix.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.source.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.source.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPercentage(item.percentage / 100)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.source.color 
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatPower(item.consumption)}h
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton Rafraîchir */}
      <div className="flex justify-center">
        <button
          onClick={loadData}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rafraîchir les Données
        </button>
      </div>
    </div>
  );
};

export default TestServices;