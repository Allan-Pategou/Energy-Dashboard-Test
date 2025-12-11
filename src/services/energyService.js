import { 
  sites, 
  buildings, 
  zones, 
  equipments,
  generateConsumptionData,
  generateRealtimeData 
} from '../data/mockData';
import { ENERGY_PRICES, ENERGY_SOURCES } from '../data/constants';

// ========================================
// SIMULATION DE DÉLAI RÉSEAU
// ========================================

/**
 * Simule un délai d'API (200-500ms)
 */
const delay = (ms = 200 + Math.random() * 300) => 
  new Promise(resolve => setTimeout(resolve, ms));

// ========================================
// RÉCUPÉRATION DES ENTITÉS
// ========================================

/**
 * Récupère tous les sites
 */
export const fetchSites = async () => {
  await delay();
  return {
    success: true,
    data: sites,
  };
};

/**
 * Récupère un site par ID
 */
export const fetchSiteById = async (siteId) => {
  await delay();
  const site = sites.find(s => s.id === siteId);
  
  if (!site) {
    return { success: false, error: 'Site non trouvé' };
  }
  
  return {
    success: true,
    data: site,
  };
};

/**
 * Récupère les bâtiments d'un site
 */
export const fetchBuildingsBySite = async (siteId) => {
  await delay();
  const siteBuildings = buildings.filter(b => b.siteId === siteId);
  
  return {
    success: true,
    data: siteBuildings,
  };
};

/**
 * Récupère un bâtiment par ID
 */
export const fetchBuildingById = async (buildingId) => {
  await delay();
  const building = buildings.find(b => b.id === buildingId);
  
  if (!building) {
    return { success: false, error: 'Bâtiment non trouvé' };
  }
  
  return {
    success: true,
    data: building,
  };
};

/**
 * Récupère les zones d'un bâtiment
 */
export const fetchZonesByBuilding = async (buildingId) => {
  await delay();
  const buildingZones = zones.filter(z => z.buildingId === buildingId);
  
  return {
    success: true,
    data: buildingZones,
  };
};

/**
 * Récupère les équipements d'une zone
 */
export const fetchEquipmentsByZone = async (zoneId) => {
  await delay();
  const zoneEquipments = equipments.filter(e => e.zoneId === zoneId);
  
  return {
    success: true,
    data: zoneEquipments,
  };
};

// ========================================
// DONNÉES DE CONSOMMATION
// ========================================

/**
 * Récupère l'historique de consommation
 * @param {string} entityId - ID de l'entité
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 */
export const fetchConsumptionHistory = async (entityId, startDate, endDate) => {
  await delay();
  
  // Génération des données (en cache normalement)
  const allData = generateConsumptionData(entityId);
  
  // Filtrage par dates
  const filtered = allData.filter(d => {
    const timestamp = new Date(d.timestamp);
    return timestamp >= startDate && timestamp <= endDate;
  });
  
  return {
    success: true,
    data: filtered,
  };
};

/**
 * Récupère les données temps réel
 */
export const fetchRealtimeData = async () => {
  await delay(100); // Plus rapide pour le temps réel
  
  const data = generateRealtimeData();
  
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Récupère les données temps réel pour une entité spécifique
 */
export const fetchRealtimeDataByEntity = async (entityId) => {
  await delay(100);
  
  const allData = generateRealtimeData();
  const entityData = allData[entityId] || allData.global;
  
  return {
    success: true,
    data: entityData,
    timestamp: new Date().toISOString(),
  };
};

// ========================================
// MIX ÉNERGÉTIQUE
// ========================================

/**
 * Récupère le mix énergétique pour une période
 * @param {string} entityId - ID de l'entité
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 */
export const fetchEnergyMix = async (entityId, startDate, endDate) => {
  await delay();
  
  const history = await fetchConsumptionHistory(entityId, startDate, endDate);
  
  if (!history.success) {
    return history;
  }
  
  // Calcul des totaux par source
  const totals = {
    electricity: 0,
    gas: 0,
    solar: 0,
  };
  
  history.data.forEach(record => {
    totals.electricity += record.sources.electricity || 0;
    totals.gas += record.sources.gas || 0;
    totals.solar += record.sources.solar || 0;
  });
  
  // Calcul des pourcentages
  const total = totals.electricity + totals.gas + totals.solar;
  
  const mix = Object.keys(totals).map(sourceId => ({
    source: ENERGY_SOURCES[sourceId],
    consumption: totals[sourceId],
    percentage: total > 0 ? (totals[sourceId] / total) * 100 : 0,
  }));
  
  return {
    success: true,
    data: mix,
  };
};

// ========================================
// CALCULS DE COÛTS ET CO₂
// ========================================

/**
 * Calcule le coût total d'une période
 * @param {Array} consumptionData - Données de consommation
 */
export const calculateCost = (consumptionData) => {
  let totalCost = 0;
  
  consumptionData.forEach(record => {
    const sources = record.sources || {};
    
    // Coût électricité
    totalCost += (sources.electricity || 0) * ENERGY_PRICES.electricity;
    
    // Coût gaz (en m³)
    totalCost += (sources.gas || 0) * ENERGY_PRICES.gas;
    
    // Solaire = gratuit
  });
  
  return totalCost;
};

/**
 * Calcule les émissions CO₂ totales
 * @param {Array} consumptionData - Données de consommation
 */
export const calculateCO2 = (consumptionData) => {
  let totalCO2 = 0;
  
  consumptionData.forEach(record => {
    const sources = record.sources || {};
    
    // CO₂ électricité
    totalCO2 += (sources.electricity || 0) * ENERGY_SOURCES.electricity.co2Factor;
    
    // CO₂ gaz
    totalCO2 += (sources.gas || 0) * ENERGY_SOURCES.gas.co2Factor;
    
    // Solaire = 0 émissions
  });
  
  return totalCO2;
};

/**
 * Récupère les statistiques pour une période
 */
export const fetchStatistics = async (entityId, startDate, endDate) => {
  await delay();
  
  const history = await fetchConsumptionHistory(entityId, startDate, endDate);
  
  if (!history.success) {
    return history;
  }
  
  const data = history.data;
  
  // Calcul consommation totale
  const totalConsumption = data.reduce((sum, record) => sum + record.totalPower, 0);
  
  // Calcul coût et CO₂
  const totalCost = calculateCost(data);
  const totalCO2 = calculateCO2(data);
  
  // Calcul moyenne
  const avgPower = data.length > 0 ? totalConsumption / data.length : 0;
  
  // Calcul min/max
  const powers = data.map(d => d.totalPower);
  const maxPower = Math.max(...powers);
  const minPower = Math.min(...powers);
  
  return {
    success: true,
    data: {
      totalConsumption,
      totalCost,
      totalCO2,
      avgPower,
      maxPower,
      minPower,
      dataPoints: data.length,
    },
  };
};

// ========================================
// COMPARAISON DE PÉRIODES
// ========================================

/**
 * Compare deux périodes
 * @param {string} entityId - ID de l'entité
 * @param {Date} period1Start - Début période 1
 * @param {Date} period1End - Fin période 1
 * @param {Date} period2Start - Début période 2
 * @param {Date} period2End - Fin période 2
 */
export const fetchComparison = async (
  entityId, 
  period1Start, 
  period1End, 
  period2Start, 
  period2End
) => {
  await delay();
  
  const [stats1, stats2] = await Promise.all([
    fetchStatistics(entityId, period1Start, period1End),
    fetchStatistics(entityId, period2Start, period2End),
  ]);
  
  if (!stats1.success || !stats2.success) {
    return { 
      success: false, 
      error: 'Erreur lors de la récupération des statistiques' 
    };
  }
  
  // Calcul des variations
  const calculateVariation = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  return {
    success: true,
    data: {
      period1: {
        ...stats1.data,
        label: 'Période actuelle',
      },
      period2: {
        ...stats2.data,
        label: 'Période précédente',
      },
      variations: {
        consumption: calculateVariation(
          stats1.data.totalConsumption, 
          stats2.data.totalConsumption
        ),
        cost: calculateVariation(stats1.data.totalCost, stats2.data.totalCost),
        co2: calculateVariation(stats1.data.totalCO2, stats2.data.totalCO2),
      },
    },
  };
};

// ========================================
// EXPORT PAR DÉFAUT
// ========================================

export default {
  // Entités
  fetchSites,
  fetchSiteById,
  fetchBuildingsBySite,
  fetchBuildingById,
  fetchZonesByBuilding,
  fetchEquipmentsByZone,
  
  // Consommation
  fetchConsumptionHistory,
  fetchRealtimeData,
  fetchRealtimeDataByEntity,
  fetchEnergyMix,
  fetchStatistics,
  fetchComparison,
  
  // Calculs
  calculateCost,
  calculateCO2,
};