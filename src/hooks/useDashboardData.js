import { useState, useEffect, useCallback } from 'react';
import { 
  fetchRealtimeData,
  fetchConsumptionHistory,
  fetchStatistics 
} from '../services/energyService';
import { calculateVariation } from '../utils/calculations';

/**
 * Hook personnalisé pour gérer les données du dashboard
 * @param {string} entityId - ID de l'entité (site, bâtiment)
 * @param {number} days - Nombre de jours d'historique
 */
const useDashboardData = (entityId = 'global', days = 7) => {
  const [realtimeData, setRealtimeData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [previousStats, setPreviousStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Charge les données temps réel
   */
  const loadRealtimeData = useCallback(async () => {
    try {
      const result = await fetchRealtimeData();
      if (result.success) {
        const data = entityId === 'global' 
          ? result.data.global 
          : result.data[entityId] || result.data.global;
        
        setRealtimeData({
          ...data,
          timestamp: result.timestamp,
        });
      }
    } catch (err) {
      console.error('Erreur chargement temps réel:', err);
    }
  }, [entityId]);

  /**
   * Charge l'historique de consommation
   */
  const loadHistoryData = useCallback(async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const result = await fetchConsumptionHistory(
        entityId === 'global' ? 'site_paris' : entityId,
        startDate,
        endDate
      );

      if (result.success) {
        setHistoryData(result.data);
      }
    } catch (err) {
      console.error('Erreur chargement historique:', err);
    }
  }, [entityId, days]);

  /**
   * Charge les statistiques (période actuelle et précédente)
   */
  const loadStatistics = useCallback(async () => {
    try {
      // Période actuelle
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const currentStats = await fetchStatistics(
        entityId === 'global' ? 'site_paris' : entityId,
        startDate,
        endDate
      );

      if (currentStats.success) {
        setStatistics(currentStats.data);
      }

      // Période précédente (pour comparaison)
      const previousEndDate = new Date(startDate);
      const previousStartDate = new Date(previousEndDate);
      previousStartDate.setDate(previousEndDate.getDate() - days);

      const prevStats = await fetchStatistics(
        entityId === 'global' ? 'site_paris' : entityId,
        previousStartDate,
        previousEndDate
      );

      if (prevStats.success) {
        setPreviousStats(prevStats.data);
      }
    } catch (err) {
      console.error('Erreur chargement statistiques:', err);
    }
  }, [entityId, days]);

  /**
   * Charge toutes les données
   */
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadRealtimeData(),
        loadHistoryData(),
        loadStatistics(),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadRealtimeData, loadHistoryData, loadStatistics]);

  /**
   * Calcul des variations par rapport à la période précédente
   */
  const getVariations = useCallback(() => {
    if (!statistics || !previousStats) {
      return {
        consumption: 0,
        cost: 0,
        co2: 0,
        avgPower: 0,
      };
    }

    return {
      consumption: calculateVariation(
        statistics.totalConsumption,
        previousStats.totalConsumption
      ),
      cost: calculateVariation(
        statistics.totalCost,
        previousStats.totalCost
      ),
      co2: calculateVariation(
        statistics.totalCO2,
        previousStats.totalCO2
      ),
      avgPower: calculateVariation(
        statistics.avgPower,
        previousStats.avgPower
      ),
    };
  }, [statistics, previousStats]);

  /**
   * Calcul du taux d'utilisation
   */
  const getUtilizationRate = useCallback(() => {
    if (!realtimeData) return 0;
    return realtimeData.utilizationRate || 0;
  }, [realtimeData]);

  // Chargement initial
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Rafraîchissement temps réel toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      loadRealtimeData();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadRealtimeData]);

  return {
    // Données
    realtimeData,
    historyData,
    statistics,
    
    // États
    loading,
    error,
    
    // Fonctions calculées
    variations: getVariations(),
    utilizationRate: getUtilizationRate(),
    
    // Actions
    refresh: loadAllData,
  };
};

export default useDashboardData;