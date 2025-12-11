import { ENERGY_PRICES, ENERGY_SOURCES, CONVERSION_FACTORS } from '../data/constants';

// ========================================
// CALCULS DE CONSOMMATION
// ========================================

/**
 * Calcule la consommation totale d'un tableau de données
 * @param {Array} data - Données de consommation
 * @returns {number} Consommation totale en kWh
 */
export const calculateTotalConsumption = (data) => {
  if (!data || data.length === 0) return 0;
  
  return data.reduce((total, record) => {
    return total + (record.consumption || record.totalPower || 0);
  }, 0);
};

/**
 * Calcule la consommation moyenne
 * @param {Array} data - Données de consommation
 * @returns {number} Moyenne en kW
 */
export const calculateAverageConsumption = (data) => {
  if (!data || data.length === 0) return 0;
  
  const total = calculateTotalConsumption(data);
  return total / data.length;
};

/**
 * Trouve les pics de consommation
 * @param {Array} data - Données de consommation
 * @param {number} topN - Nombre de pics à retourner
 * @returns {Array} Pics de consommation triés
 */
export const findConsumptionPeaks = (data, topN = 10) => {
  if (!data || data.length === 0) return [];
  
  return [...data]
    .sort((a, b) => (b.totalPower || 0) - (a.totalPower || 0))
    .slice(0, topN);
};

// ========================================
// CALCULS DE COÛTS
// ========================================

/**
 * Calcule le coût d'une consommation
 * @param {number} consumption - Consommation en kWh ou m³
 * @param {string} sourceId - ID de la source d'énergie
 * @returns {number} Coût en €
 */
export const calculateEnergyCost = (consumption, sourceId) => {
  const price = ENERGY_PRICES[sourceId] || 0;
  return consumption * price;
};

/**
 * Calcule le coût total d'un mix énergétique
 * @param {Object} sources - { electricity: xxx, gas: xxx, ... }
 * @returns {number} Coût total en €
 */
export const calculateTotalCost = (sources) => {
  let total = 0;
  
  Object.keys(sources).forEach(sourceId => {
    const consumption = sources[sourceId] || 0;
    total += calculateEnergyCost(consumption, sourceId);
  });
  
  return total;
};

/**
 * Calcule le coût par kWh équivalent
 * @param {number} totalCost - Coût total en €
 * @param {number} totalConsumption - Consommation totale en kWh
 * @returns {number} Coût unitaire en €/kWh
 */
export const calculateUnitCost = (totalCost, totalConsumption) => {
  if (totalConsumption === 0) return 0;
  return totalCost / totalConsumption;
};

// ========================================
// CALCULS D'ÉMISSIONS CO₂
// ========================================

/**
 * Calcule les émissions CO₂ d'une consommation
 * @param {number} consumption - Consommation
 * @param {string} sourceId - ID de la source d'énergie
 * @returns {number} Émissions en kg CO₂
 */
export const calculateCO2Emissions = (consumption, sourceId) => {
  const source = ENERGY_SOURCES[sourceId];
  if (!source) return 0;
  
  return consumption * source.co2Factor;
};

/**
 * Calcule les émissions totales d'un mix énergétique
 * @param {Object} sources - { electricity: xxx, gas: xxx, ... }
 * @returns {number} Émissions totales en kg CO₂
 */
export const calculateTotalCO2 = (sources) => {
  let total = 0;
  
  Object.keys(sources).forEach(sourceId => {
    const consumption = sources[sourceId] || 0;
    total += calculateCO2Emissions(consumption, sourceId);
  });
  
  return total;
};

/**
 * Calcule l'équivalent en arbres à planter
 * @param {number} co2Kg - Émissions en kg CO₂
 * @returns {number} Nombre d'arbres équivalents
 */
export const calculateTreesEquivalent = (co2Kg) => {
  // Un arbre absorbe environ 20 kg de CO₂ par an
  const co2PerTree = 20;
  return Math.ceil(co2Kg / co2PerTree);
};

// ========================================
// CALCULS DE VARIATIONS
// ========================================

/**
 * Calcule la variation entre deux valeurs
 * @param {number} current - Valeur actuelle
 * @param {number} previous - Valeur précédente
 * @returns {number} Variation en % (positif = hausse, négatif = baisse)
 */
export const calculateVariation = (current, previous) => {
  if (previous === 0 || !previous) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Calcule la différence absolue
 * @param {number} current - Valeur actuelle
 * @param {number} previous - Valeur précédente
 * @returns {number} Différence
 */
export const calculateDifference = (current, previous) => {
  return current - previous;
};

/**
 * Calcule les économies réalisées
 * @param {number} previous - Coût précédent
 * @param {number} current - Coût actuel
 * @returns {Object} { amount: €, percentage: % }
 */
export const calculateSavings = (previous, current) => {
  const amount = previous - current;
  const percentage = calculateVariation(current, previous);
  
  return {
    amount,
    percentage: -percentage, // Négatif car on veut les économies
    isSaving: amount > 0,
  };
};

// ========================================
// CALCULS STATISTIQUES
// ========================================

/**
 * Calcule la médiane d'un tableau de valeurs
 * @param {Array} values - Tableau de nombres
 * @returns {number} Médiane
 */
export const calculateMedian = (values) => {
  if (!values || values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
};

/**
 * Calcule l'écart-type
 * @param {Array} values - Tableau de nombres
 * @returns {number} Écart-type
 */
export const calculateStandardDeviation = (values) => {
  if (!values || values.length === 0) return 0;
  
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return Math.sqrt(variance);
};

/**
 * Calcule le min, max, moyenne d'un dataset
 * @param {Array} data - Données
 * @param {string} key - Clé à analyser (ex: 'totalPower')
 * @returns {Object} { min, max, avg, median }
 */
export const calculateStats = (data, key = 'totalPower') => {
  if (!data || data.length === 0) {
    return { min: 0, max: 0, avg: 0, median: 0 };
  }
  
  const values = data.map(d => d[key] || 0);
  
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((sum, val) => sum + val, 0) / values.length,
    median: calculateMedian(values),
  };
};

// ========================================
// CALCULS DE RATIOS ET INDICES
// ========================================

/**
 * Calcule le taux d'utilisation
 * @param {number} actualPower - Puissance actuelle (kW)
 * @param {number} maxPower - Puissance maximale (kW)
 * @returns {number} Ratio entre 0 et 1
 */
export const calculateUtilizationRate = (actualPower, maxPower) => {
  if (maxPower === 0) return 0;
  return Math.min(actualPower / maxPower, 1);
};

/**
 * Calcule l'intensité énergétique
 * @param {number} consumption - Consommation (kWh)
 * @param {number} production - Production ou surface (unités, m²)
 * @returns {number} Intensité (kWh/unité ou kWh/m²)
 */
export const calculateEnergyIntensity = (consumption, production) => {
  if (production === 0) return 0;
  return consumption / production;
};

/**
 * Calcule le facteur de charge
 * @param {number} avgPower - Puissance moyenne (kW)
 * @param {number} peakPower - Puissance de pointe (kW)
 * @returns {number} Facteur entre 0 et 1
 */
export const calculateLoadFactor = (avgPower, peakPower) => {
  if (peakPower === 0) return 0;
  return avgPower / peakPower;
};

// ========================================
// CONVERSIONS D'UNITÉS
// ========================================

/**
 * Convertit kW en MW
 */
export const kWtoMW = (kw) => kw * CONVERSION_FACTORS.kWtoMW;

/**
 * Convertit kWh en MWh
 */
export const kWhtoMWh = (kwh) => kwh * CONVERSION_FACTORS.kWhtoMWh;

/**
 * Convertit m³ de gaz en kWh équivalent
 */
export const m3toKWh = (m3) => m3 * CONVERSION_FACTORS.m3toKWh;

/**
 * Convertit litres de fioul en kWh équivalent
 */
export const LtoKWh = (liters) => liters * CONVERSION_FACTORS.LtoKWh;

// ========================================
// PRÉDICTIONS SIMPLES
// ========================================

/**
 * Projette la consommation journalière
 * @param {number} currentConsumption - Consommation actuelle (kWh)
 * @param {number} hoursElapsed - Heures écoulées depuis minuit
 * @returns {number} Projection sur 24h
 */
export const projectDailyConsumption = (currentConsumption, hoursElapsed) => {
  if (hoursElapsed === 0) return currentConsumption;
  return (currentConsumption / hoursElapsed) * 24;
};

/**
 * Projette le coût mensuel
 * @param {number} dailyAverage - Coût moyen journalier (€)
 * @param {number} daysInMonth - Nombre de jours dans le mois (30 par défaut)
 * @returns {number} Projection mensuelle
 */
export const projectMonthlyCost = (dailyAverage, daysInMonth = 30) => {
  return dailyAverage * daysInMonth;
};

// ========================================
// EXPORT PAR DÉFAUT
// ========================================

export default {
  // Consommation
  calculateTotalConsumption,
  calculateAverageConsumption,
  findConsumptionPeaks,
  
  // Coûts
  calculateEnergyCost,
  calculateTotalCost,
  calculateUnitCost,
  
  // CO₂
  calculateCO2Emissions,
  calculateTotalCO2,
  calculateTreesEquivalent,
  
  // Variations
  calculateVariation,
  calculateDifference,
  calculateSavings,
  
  // Statistiques
  calculateMedian,
  calculateStandardDeviation,
  calculateStats,
  
  // Ratios
  calculateUtilizationRate,
  calculateEnergyIntensity,
  calculateLoadFactor,
  
  // Conversions
  kWtoMW,
  kWhtoMWh,
  m3toKWh,
  LtoKWh,
  
  // Prédictions
  projectDailyConsumption,
  projectMonthlyCost,
};