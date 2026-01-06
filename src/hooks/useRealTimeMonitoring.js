import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRealtimeData } from '../services/energyService';
import { ALERT_THRESHOLDS } from '../data/constants';

/**
 * Hook pour le monitoring temps réel avec détection d'alertes
 * @param {string} entityId - ID de l'entité à surveiller
 * @param {number} refreshInterval - Intervalle de rafraîchissement (ms)
 */
const useRealTimeMonitoring = (entityId = 'global', refreshInterval = 3000) => {
  const [currentData, setCurrentData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);
  const maxHistoryLength = 20; // Garder les 20 dernières valeurs

  /**
   * Détecte les alertes basées sur les seuils
   */
  const detectAlerts = useCallback((data, prevData) => {
    const newAlerts = [];
    const now = new Date();

    // Alerte : Consommation élevée
    if (data.instantPower > ALERT_THRESHOLDS.high) {
      newAlerts.push({
        type: 'warning',
        message: 'Consommation élevée détectée',
        value: `${data.instantPower.toFixed(0)} kW`,
        timestamp: now,
      });
    }

    // Alerte : Consommation critique
    if (data.instantPower > ALERT_THRESHOLDS.critical) {
      newAlerts.push({
        type: 'critical',
        message: 'Consommation critique !',
        value: `${data.instantPower.toFixed(0)} kW`,
        timestamp: now,
      });
    }

    // Alerte : Variation brutale (>20% en une minute)
    if (prevData) {
      const variation = ((data.instantPower - prevData.instantPower) / prevData.instantPower) * 100;
      
      if (Math.abs(variation) > 20) {
        newAlerts.push({
          type: 'warning',
          message: variation > 0 ? 'Pic de consommation détecté' : 'Chute de consommation détectée',
          value: `${variation > 0 ? '+' : ''}${variation.toFixed(1)}%`,
          timestamp: now,
        });
      }
    }

    // Alerte : Coût journalier élevé
    if (data.dailyCost > 8000) {
      newAlerts.push({
        type: 'info',
        message: 'Coût journalier élevé',
        value: `${data.dailyCost.toFixed(0)} €`,
        timestamp: now,
      });
    }

    // Limiter le nombre d'alertes affichées
    return newAlerts.slice(0, 5);
  }, []);

  /**
   * Charge les données temps réel
   */
  const loadRealtimeData = useCallback(async () => {
    if (!isLive) return;

    try {
      const result = await fetchRealtimeData();
      
      if (result.success) {
        const data = entityId === 'global' 
          ? result.data.global 
          : result.data[entityId] || result.data.global;

        // Mettre à jour les données
        setPreviousData(currentData);
        setCurrentData(data);
        setLastUpdate(new Date());

        // Ajouter à l'historique
        setHistory(prev => {
          const newHistory = [...prev, {
            ...data,
            timestamp: new Date(),
          }];
          return newHistory.slice(-maxHistoryLength);
        });

        // Détecter les alertes
        const newAlerts = detectAlerts(data, currentData);
        if (newAlerts.length > 0) {
          setAlerts(prev => {
            // Garder les 10 dernières alertes uniques
            const combined = [...newAlerts, ...prev];
            const unique = combined.filter((alert, index, self) =>
              index === self.findIndex(a => a.message === alert.message)
            );
            return unique.slice(0, 10);
          });
        }
      }
    } catch (error) {
      console.error('Erreur chargement temps réel:', error);
    }
  }, [entityId, isLive, currentData, detectAlerts]);

  /**
   * Démarrer le monitoring
   */
  const start = useCallback(() => {
    setIsLive(true);
  }, []);

  /**
   * Arrêter le monitoring
   */
  const stop = useCallback(() => {
    setIsLive(false);
  }, []);

  /**
   * Toggle pause/play
   */
  const toggle = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  /**
   * Effacer les alertes
   */
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  /**
   * Calculer la tendance (variation par rapport à la valeur précédente)
   */
  const getTrend = useCallback((field) => {
    if (!currentData || !previousData) return 0;
    
    const current = currentData[field] || 0;
    const previous = previousData[field] || 0;
    
    if (previous === 0) return 0;
    
    return ((current - previous) / previous) * 100;
  }, [currentData, previousData]);

  // Chargement initial
  useEffect(() => {
    loadRealtimeData();
  }, []);

  // Boucle de rafraîchissement
  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(loadRealtimeData, refreshInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, loadRealtimeData, refreshInterval]);

  return {
    currentData,
    previousData,
    history,
    alerts,
    isLive,
    lastUpdate,
    start,
    stop,
    toggle,
    clearAlerts,
    getTrend,
  };
};

export default useRealTimeMonitoring;