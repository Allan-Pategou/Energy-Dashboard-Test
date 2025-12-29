import { useState, useEffect, useCallback } from 'react';
import { 
  fetchComparison, 
  fetchConsumptionHistory,
  fetchEnergyMix 
} from '../services/energyService';

/**
 * Hook pour gérer les comparaisons de périodes
 * @param {string} entityId - ID de l'entité
 * @param {string} comparisonType - Type ('day', 'week', 'month', 'year')
 */
const useComparison = (entityId = 'site_paris', comparisonType = 'week') => {
  const [comparisonData, setComparisonData] = useState(null);
  const [period1Data, setPeriod1Data] = useState([]);
  const [period2Data, setPeriod2Data] = useState([]);
  const [energyMix1, setEnergyMix1] = useState([]);
  const [energyMix2, setEnergyMix2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calcule les dates selon le type de comparaison
   */
  const calculateDates = useCallback(() => {
    const now = new Date();
    let period1Start, period1End, period2Start, period2End;

    switch (comparisonType) {
      case 'day':
        // Aujourd'hui vs Hier
        period1End = new Date(now);
        period1Start = new Date(now);
        period1Start.setHours(0, 0, 0, 0);
        
        period2End = new Date(period1Start);
        period2Start = new Date(period2End);
        period2Start.setDate(period2Start.getDate() - 1);
        break;

      case 'week':
        // Cette semaine vs Semaine dernière
        period1End = new Date(now);
        period1Start = new Date(now);
        period1Start.setDate(now.getDate() - 7);
        
        period2End = new Date(period1Start);
        period2Start = new Date(period2End);
        period2Start.setDate(period2Start.getDate() - 7);
        break;

      case 'month':
        // Ce mois vs Mois dernier
        period1End = new Date(now);
        period1Start = new Date(now);
        period1Start.setDate(now.getDate() - 30);
        
        period2End = new Date(period1Start);
        period2Start = new Date(period2End);
        period2Start.setDate(period2Start.getDate() - 30);
        break;

      case 'year':
        // Cette année vs Année dernière
        period1End = new Date(now);
        period1Start = new Date(now);
        period1Start.setFullYear(now.getFullYear() - 1);
        
        period2End = new Date(period1Start);
        period2Start = new Date(period2End);
        period2Start.setFullYear(period2Start.getFullYear() - 1);
        break;

      default:
        period1End = new Date(now);
        period1Start = new Date(now);
        period1Start.setDate(now.getDate() - 7);
        period2End = new Date(period1Start);
        period2Start = new Date(period2End);
        period2Start.setDate(period2Start.getDate() - 7);
    }

    return { period1Start, period1End, period2Start, period2End };
  }, [comparisonType]);

  /**
   * Charge les données de comparaison
   */
  const loadComparisonData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { period1Start, period1End, period2Start, period2End } = calculateDates();

      // Charger les statistiques comparatives
      const compResult = await fetchComparison(
        entityId,
        period1Start,
        period1End,
        period2Start,
        period2End
      );

      if (compResult.success) {
        setComparisonData(compResult.data);
      }

      // Charger l'historique des deux périodes
      const [history1, history2] = await Promise.all([
        fetchConsumptionHistory(entityId, period1Start, period1End),
        fetchConsumptionHistory(entityId, period2Start, period2End),
      ]);

      if (history1.success) setPeriod1Data(history1.data);
      if (history2.success) setPeriod2Data(history2.data);

      // Charger le mix énergétique des deux périodes
      const [mix1, mix2] = await Promise.all([
        fetchEnergyMix(entityId, period1Start, period1End),
        fetchEnergyMix(entityId, period2Start, period2End),
      ]);

      if (mix1.success) setEnergyMix1(mix1.data);
      if (mix2.success) setEnergyMix2(mix2.data);

    } catch (err) {
      setError(err.message);
      console.error('Erreur comparaison:', err);
    } finally {
      setLoading(false);
    }
  }, [entityId, comparisonType, calculateDates]);

  // Chargement initial et au changement de type
  useEffect(() => {
    loadComparisonData();
  }, [loadComparisonData]);

  /**
   * Labels des périodes
   */
  const getPeriodLabels = useCallback(() => {
    switch (comparisonType) {
      case 'day':
        return { period1: "Aujourd'hui", period2: 'Hier' };
      case 'week':
        return { period1: 'Cette semaine', period2: 'Semaine dernière' };
      case 'month':
        return { period1: 'Ce mois', period2: 'Mois dernier' };
      case 'year':
        return { period1: 'Cette année', period2: 'Année dernière' };
      default:
        return { period1: 'Période 1', period2: 'Période 2' };
    }
  }, [comparisonType]);

  return {
    comparisonData,
    period1Data,
    period2Data,
    energyMix1,
    energyMix2,
    periodLabels: getPeriodLabels(),
    loading,
    error,
    refresh: loadComparisonData,
  };
};

export default useComparison;