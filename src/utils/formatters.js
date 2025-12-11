import { format, formatDistance, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// ========================================
// FORMATAGE DES NOMBRES
// ========================================

/**
 * Formate un nombre avec séparateurs de milliers
 * @param {number} value - Valeur à formater
 * @param {number} decimals - Nombre de décimales
 * @returns {string}
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formate une valeur de puissance (kW, MW, GW)
 * @param {number} kw - Puissance en kW
 * @param {boolean} autoUnit - Conversion automatique d'unité
 * @returns {string}
 */
export const formatPower = (kw, autoUnit = true) => {
  if (kw === null || kw === undefined || isNaN(kw)) {
    return '0 kW';
  }
  
  if (!autoUnit) {
    return `${formatNumber(kw, 1)} kW`;
  }
  
  if (kw >= 1000) {
    return `${formatNumber(kw / 1000, 2)} MW`;
  }
  
  if (kw >= 1000000) {
    return `${formatNumber(kw / 1000000, 2)} GW`;
  }
  
  return `${formatNumber(kw, 1)} kW`;
};

/**
 * Formate une valeur d'énergie (kWh, MWh)
 * @param {number} kwh - Énergie en kWh
 * @param {boolean} autoUnit - Conversion automatique d'unité
 * @returns {string}
 */
export const formatEnergy = (kwh, autoUnit = true) => {
  if (kwh === null || kwh === undefined || isNaN(kwh)) {
    return '0 kWh';
  }
  
  if (!autoUnit) {
    return `${formatNumber(kwh, 0)} kWh`;
  }
  
  if (kwh >= 1000) {
    return `${formatNumber(kwh / 1000, 2)} MWh`;
  }
  
  return `${formatNumber(kwh, 0)} kWh`;
};

/**
 * Formate un coût en euros
 * @param {number} cost - Coût en €
 * @param {boolean} compact - Format compact (k€, M€)
 * @returns {string}
 */
export const formatCost = (cost, compact = false) => {
  if (cost === null || cost === undefined || isNaN(cost)) {
    return '0 €';
  }
  
  if (compact && cost >= 1000000) {
    return `${formatNumber(cost / 1000000, 2)} M€`;
  }
  
  if (compact && cost >= 1000) {
    return `${formatNumber(cost / 1000, 1)} k€`;
  }
  
  return `${formatNumber(cost, 2)} €`;
};

/**
 * Formate des émissions CO₂
 * @param {number} kg - Émissions en kg
 * @param {boolean} autoUnit - Conversion automatique (kg/tonnes)
 * @returns {string}
 */
export const formatCO2 = (kg, autoUnit = true) => {
  if (kg === null || kg === undefined || isNaN(kg)) {
    return '0 kg CO₂';
  }
  
  if (autoUnit && kg >= 1000) {
    return `${formatNumber(kg / 1000, 2)} tonnes CO₂`;
  }
  
  return `${formatNumber(kg, 1)} kg CO₂`;
};

/**
 * Formate un pourcentage
 * @param {number} value - Valeur décimale (0-1) ou pourcentage (0-100)
 * @param {boolean} isDecimal - True si valeur entre 0 et 1
 * @param {number} decimals - Nombre de décimales
 * @returns {string}
 */
export const formatPercentage = (value, isDecimal = true, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  const percentage = isDecimal ? value * 100 : value;
  return `${formatNumber(percentage, decimals)}%`;
};

// ========================================
// FORMATAGE DES DATES
// ========================================

/**
 * Formate une date complète
 * @param {Date|string} date - Date à formater
 * @param {string} formatString - Format (défaut: 'dd/MM/yyyy HH:mm')
 * @returns {string}
 */
export const formatDate = (date, formatString = 'dd/MM/yyyy HH:mm') => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatString, { locale: fr });
  } catch (error) {
    console.error('Erreur formatage date:', error);
    return '-';
  }
};

/**
 * Formate une date courte (juste la date)
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateShort = (date) => {
  return formatDate(date, 'dd/MM/yyyy');
};

/**
 * Formate une heure
 * @param {Date|string} date
 * @returns {string}
 */
export const formatTime = (date) => {
  return formatDate(date, 'HH:mm');
};

/**
 * Formate une date relative ("il y a 5 minutes")
 * @param {Date|string} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { 
      addSuffix: true, 
      locale: fr 
    });
  } catch (error) {
    console.error('Erreur formatage date relative:', error);
    return '-';
  }
};

/**
 * Formate la distance entre deux dates
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {string}
 */
export const formatDateDistance = (date1, date2) => {
  if (!date1 || !date2) return '-';
  
  try {
    const dateObj1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const dateObj2 = typeof date2 === 'string' ? new Date(date2) : date2;
    return formatDistance(dateObj1, dateObj2, { locale: fr });
  } catch (error) {
    console.error('Erreur formatage distance:', error);
    return '-';
  }
};

// ========================================
// FORMATAGE DES VARIATIONS
// ========================================

/**
 * Formate une variation avec icône et couleur
 * @param {number} variation - Variation en %
 * @param {boolean} inverseColors - Inverse les couleurs (rouge = bon)
 * @returns {Object} { text, color, icon }
 */
export const formatVariation = (variation, inverseColors = false) => {
  if (variation === null || variation === undefined || isNaN(variation)) {
    return {
      text: '0%',
      color: 'text-gray-500',
      icon: '→',
    };
  }
  
  const absVariation = Math.abs(variation);
  const formatted = `${variation > 0 ? '+' : ''}${formatNumber(variation, 1)}%`;
  
  // Couleurs normales: vert = baisse (bien), rouge = hausse (mal)
  // Couleurs inverses: rouge = baisse (mal), vert = hausse (bien)
  const isPositive = inverseColors ? variation > 0 : variation < 0;
  
  if (absVariation < 1) {
    return {
      text: formatted,
      color: 'text-gray-500',
      icon: '→',
    };
  }
  
  if (isPositive) {
    return {
      text: formatted,
      color: 'text-energy-low',
      icon: variation < 0 ? '↓' : '↑',
    };
  }
  
  return {
    text: formatted,
    color: 'text-energy-high',
    icon: variation > 0 ? '↑' : '↓',
  };
};

// ========================================
// FORMATAGE AVANCÉ
// ========================================

/**
 * Formate un grand nombre avec suffixe (K, M, B)
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export const formatCompactNumber = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1000000000) {
    return `${sign}${formatNumber(absValue / 1000000000, decimals)}B`;
  }
  
  if (absValue >= 1000000) {
    return `${sign}${formatNumber(absValue / 1000000, decimals)}M`;
  }
  
  if (absValue >= 1000) {
    return `${sign}${formatNumber(absValue / 1000, decimals)}K`;
  }
  
  return `${sign}${formatNumber(absValue, decimals)}`;
};

/**
 * Formate une durée en heures/minutes
 * @param {number} minutes - Durée en minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined || isNaN(minutes)) {
    return '0 min';
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }
  
  return `${mins} min`;
};

// ========================================
// EXPORT PAR DÉFAUT
// ========================================

export default {
  formatNumber,
  formatPower,
  formatEnergy,
  formatCost,
  formatCO2,
  formatPercentage,
  formatDate,
  formatDateShort,
  formatTime,
  formatRelativeTime,
  formatDateDistance,
  formatVariation,
  formatCompactNumber,
  formatDuration,
};