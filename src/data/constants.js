// ========================================
// SOURCES D'ÉNERGIE
// ========================================

export const ENERGY_SOURCES = {
  electricity: {
    id: 'electricity',
    name: 'Électricité',
    unit: 'kWh',
    color: '#3B82F6', // Bleu
    co2Factor: 0.0571, // kg CO₂/kWh (mix France 2024)
    icon: '⚡',
  },
  gas: {
    id: 'gas',
    name: 'Gaz Naturel',
    unit: 'm³',
    color: '#F59E0B', // Orange
    co2Factor: 2.03, // kg CO₂/m³
    icon: '🔥',
  },
  solar: {
    id: 'solar',
    name: 'Solaire',
    unit: 'kWh',
    color: '#FBBF24', // Jaune
    co2Factor: 0.0, // Pas d'émissions
    icon: '☀️',
  },
  wind: {
    id: 'wind',
    name: 'Éolien',
    unit: 'kWh',
    color: '#06B6D4', // Cyan
    co2Factor: 0.0, // Pas d'émissions
    icon: '💨',
  },
  fuel: {
    id: 'fuel',
    name: 'Fioul',
    unit: 'L',
    color: '#6B7280', // Gris
    co2Factor: 2.67, // kg CO₂/L
    icon: '🛢️',
  },
};

// ========================================
// TARIFS ÉNERGÉTIQUES (€)
// ========================================

export const ENERGY_PRICES = {
  electricity: 0.1893, // €/kWh (tarif bleu EDF 2024)
  gas: 0.0878, // €/m³
  solar: 0.0, // Gratuit (production propre)
  wind: 0.0, // Gratuit (production propre)
  fuel: 1.15, // €/L
};

// ========================================
// TYPES D'ENTITÉS
// ========================================

export const ENTITY_TYPES = {
  SITE: 'site',
  BUILDING: 'building',
  ZONE: 'zone',
  PROCESS: 'process',
  EQUIPMENT: 'equipment',
};

// ========================================
// SEUILS D'ALERTE (kW)
// ========================================

export const ALERT_THRESHOLDS = {
  low: 300, // Consommation basse < 300 kW
  medium: 500, // Consommation moyenne 300-500 kW
  high: 800, // Consommation élevée 500-800 kW
  critical: 800, // Critique > 800 kW
};

// ========================================
// PÉRIODES DE TEMPS
// ========================================

export const TIME_PERIODS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
  CUSTOM: 'custom',
};

// ========================================
// HEURES DE POINTE/CREUSE
// ========================================

export const PEAK_HOURS = {
  offPeak: [0, 1, 2, 3, 4, 5, 6, 22, 23], // Heures creuses
  peak: [8, 9, 10, 11, 12, 17, 18, 19, 20], // Heures de pointe
  normal: [7, 13, 14, 15, 16, 21], // Heures normales
};

// ========================================
// FACTEURS DE CONVERSION
// ========================================

export const CONVERSION_FACTORS = {
  kWtoMW: 0.001,
  kWhtoMWh: 0.001,
  m3toKWh: 10.3, // Gaz naturel
  LtoKWh: 10.0, // Fioul
};

// ========================================
// OBJECTIFS CO₂ (kg/jour)
// ========================================

export const CO2_TARGETS = {
  daily: 150, // Objectif journalier
  monthly: 4500, // Objectif mensuel
  yearly: 54000, // Objectif annuel
};

// ========================================
// CODES COULEUR POUR L'UI
// ========================================

export const STATUS_COLORS = {
  success: '#10B981', // Vert
  warning: '#F59E0B', // Orange
  danger: '#EF4444', // Rouge
  info: '#3B82F6', // Bleu
  neutral: '#6B7280', // Gris
};