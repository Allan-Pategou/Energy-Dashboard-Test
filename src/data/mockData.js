import { ENERGY_SOURCES, ENTITY_TYPES } from './constants';

// ========================================
// SITES (3 sites industriels)
// ========================================

export const sites = [
  {
    id: 'site_paris',
    name: 'Site Paris',
    type: ENTITY_TYPES.SITE,
    location: {
      city: 'Paris',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    area: 15000, // m²
    buildings: ['building_paris_1', 'building_paris_2', 'building_paris_3'],
  },
  {
    id: 'site_lyon',
    name: 'Site Lyon',
    type: ENTITY_TYPES.SITE,
    location: {
      city: 'Lyon',
      country: 'France',
      coordinates: { lat: 45.764, lng: 4.8357 },
    },
    area: 12000, // m²
    buildings: ['building_lyon_1', 'building_lyon_2'],
  },
  {
    id: 'site_marseille',
    name: 'Site Marseille',
    type: ENTITY_TYPES.SITE,
    location: {
      city: 'Marseille',
      country: 'France',
      coordinates: { lat: 43.2965, lng: 5.3698 },
    },
    area: 18000, // m²
    buildings: ['building_marseille_1', 'building_marseille_2', 'building_marseille_3'],
  },
];

// ========================================
// BÂTIMENTS (8 bâtiments au total)
// ========================================

export const buildings = [
  // Paris
  {
    id: 'building_paris_1',
    name: 'Atelier Production A',
    siteId: 'site_paris',
    type: ENTITY_TYPES.BUILDING,
    area: 5000,
    zones: ['zone_paris_1_1', 'zone_paris_1_2'],
  },
  {
    id: 'building_paris_2',
    name: 'Entrepôt Logistique',
    siteId: 'site_paris',
    type: ENTITY_TYPES.BUILDING,
    area: 7000,
    zones: ['zone_paris_2_1'],
  },
  {
    id: 'building_paris_3',
    name: 'Bureaux Administratifs',
    siteId: 'site_paris',
    type: ENTITY_TYPES.BUILDING,
    area: 3000,
    zones: ['zone_paris_3_1'],
  },
  
  // Lyon
  {
    id: 'building_lyon_1',
    name: 'Atelier Production B',
    siteId: 'site_lyon',
    type: ENTITY_TYPES.BUILDING,
    area: 6000,
    zones: ['zone_lyon_1_1', 'zone_lyon_1_2'],
  },
  {
    id: 'building_lyon_2',
    name: 'Centre de Distribution',
    siteId: 'site_lyon',
    type: ENTITY_TYPES.BUILDING,
    area: 6000,
    zones: ['zone_lyon_2_1'],
  },
  
  // Marseille
  {
    id: 'building_marseille_1',
    name: 'Usine Principale',
    siteId: 'site_marseille',
    type: ENTITY_TYPES.BUILDING,
    area: 8000,
    zones: ['zone_marseille_1_1', 'zone_marseille_1_2', 'zone_marseille_1_3'],
  },
  {
    id: 'building_marseille_2',
    name: 'Entrepôt Frigorifique',
    siteId: 'site_marseille',
    type: ENTITY_TYPES.BUILDING,
    area: 5000,
    zones: ['zone_marseille_2_1'],
  },
  {
    id: 'building_marseille_3',
    name: 'Laboratoire R&D',
    siteId: 'site_marseille',
    type: ENTITY_TYPES.BUILDING,
    area: 5000,
    zones: ['zone_marseille_3_1'],
  },
];

// ========================================
// ZONES (15 zones au total)
// ========================================

export const zones = [
  // Paris - Atelier Production A
  { id: 'zone_paris_1_1', name: 'Ligne d\'assemblage 1', buildingId: 'building_paris_1', area: 2500 },
  { id: 'zone_paris_1_2', name: 'Ligne d\'assemblage 2', buildingId: 'building_paris_1', area: 2500 },
  
  // Paris - Entrepôt
  { id: 'zone_paris_2_1', name: 'Zone de stockage', buildingId: 'building_paris_2', area: 7000 },
  
  // Paris - Bureaux
  { id: 'zone_paris_3_1', name: 'Étages bureaux', buildingId: 'building_paris_3', area: 3000 },
  
  // Lyon
  { id: 'zone_lyon_1_1', name: 'Fabrication', buildingId: 'building_lyon_1', area: 3000 },
  { id: 'zone_lyon_1_2', name: 'Conditionnement', buildingId: 'building_lyon_1', area: 3000 },
  { id: 'zone_lyon_2_1', name: 'Distribution', buildingId: 'building_lyon_2', area: 6000 },
  
  // Marseille
  { id: 'zone_marseille_1_1', name: 'Production principale', buildingId: 'building_marseille_1', area: 3000 },
  { id: 'zone_marseille_1_2', name: 'Emballage', buildingId: 'building_marseille_1', area: 2500 },
  { id: 'zone_marseille_1_3', name: 'Contrôle qualité', buildingId: 'building_marseille_1', area: 2500 },
  { id: 'zone_marseille_2_1', name: 'Chambre froide', buildingId: 'building_marseille_2', area: 5000 },
  { id: 'zone_marseille_3_1', name: 'Laboratoires', buildingId: 'building_marseille_3', area: 5000 },
];

// ========================================
// ÉQUIPEMENTS (20 équipements clés)
// ========================================

export const equipments = [
  // Paris
  { id: 'eq_paris_1', name: 'Compresseur A1', zoneId: 'zone_paris_1_1', type: 'compressor', power: 75 },
  { id: 'eq_paris_2', name: 'Convoyeur L1', zoneId: 'zone_paris_1_1', type: 'conveyor', power: 15 },
  { id: 'eq_paris_3', name: 'Robot soudure R1', zoneId: 'zone_paris_1_2', type: 'robot', power: 45 },
  { id: 'eq_paris_4', name: 'Climatisation B2', zoneId: 'zone_paris_2_1', type: 'hvac', power: 120 },
  { id: 'eq_paris_5', name: 'Éclairage LED B3', zoneId: 'zone_paris_3_1', type: 'lighting', power: 25 },
  
  // Lyon
  { id: 'eq_lyon_1', name: 'Presse hydraulique P1', zoneId: 'zone_lyon_1_1', type: 'press', power: 200 },
  { id: 'eq_lyon_2', name: 'Four industriel F1', zoneId: 'zone_lyon_1_1', type: 'furnace', power: 350 },
  { id: 'eq_lyon_3', name: 'Ensacheuse E1', zoneId: 'zone_lyon_1_2', type: 'packaging', power: 30 },
  { id: 'eq_lyon_4', name: 'Chariot élévateur C1', zoneId: 'zone_lyon_2_1', type: 'forklift', power: 8 },
  
  // Marseille
  { id: 'eq_marseille_1', name: 'Extrudeuse EX1', zoneId: 'zone_marseille_1_1', type: 'extruder', power: 280 },
  { id: 'eq_marseille_2', name: 'Malaxeur M1', zoneId: 'zone_marseille_1_1', type: 'mixer', power: 95 },
  { id: 'eq_marseille_3', name: 'Ligne d\'emballage LE1', zoneId: 'zone_marseille_1_2', type: 'packaging', power: 55 },
  { id: 'eq_marseille_4', name: 'Spectromètre S1', zoneId: 'zone_marseille_1_3', type: 'lab_equipment', power: 12 },
  { id: 'eq_marseille_5', name: 'Groupe froid GF1', zoneId: 'zone_marseille_2_1', type: 'refrigeration', power: 450 },
  { id: 'eq_marseille_6', name: 'Groupe froid GF2', zoneId: 'zone_marseille_2_1', type: 'refrigeration', power: 450 },
  { id: 'eq_marseille_7', name: 'Microscope électronique M1', zoneId: 'zone_marseille_3_1', type: 'lab_equipment', power: 8 },
  { id: 'eq_marseille_8', name: 'Centrifugeuse C1', zoneId: 'zone_marseille_3_1', type: 'lab_equipment', power: 18 },
];

// ========================================
// FONCTION : Générer données de consommation
// ========================================

/**
 * Génère des données de consommation horaire pour les 30 derniers jours
 * @param {string} entityId - ID de l'entité (site, bâtiment, etc.)
 * @param {number} basePower - Puissance de base (kW)
 * @returns {Array} Tableau de données de consommation
 */
export const generateConsumptionData = (entityId, basePower = 500) => {
  const data = [];
  const now = new Date();
  const daysToGenerate = 30;
  const hoursPerDay = 24;

  for (let day = daysToGenerate; day >= 0; day--) {
    for (let hour = 0; hour < hoursPerDay; hour++) {
      const timestamp = new Date(now);
      timestamp.setDate(now.getDate() - day);
      timestamp.setHours(hour, 0, 0, 0);

      // Variation selon l'heure (nuit vs jour)
      const hourFactor = hour >= 6 && hour <= 22 ? 1.0 : 0.4;
      
      // Variation selon le jour (weekend vs semaine)
      const dayOfWeek = timestamp.getDay();
      const dayFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.5 : 1.0;
      
      // Variation aléatoire ±15%
      const randomFactor = 0.85 + Math.random() * 0.3;
      
      // Calcul puissance instantanée
      const instantPower = basePower * hourFactor * dayFactor * randomFactor;
      
      // Répartition par source d'énergie
      const electricityRatio = 0.70;
      const gasRatio = 0.20;
      const solarRatio = (hour >= 8 && hour <= 18) ? 0.10 : 0.0;

      data.push({
        timestamp: timestamp.toISOString(),
        entityId,
        sources: {
          electricity: instantPower * electricityRatio,
          gas: instantPower * gasRatio * 0.1, // Convertir en m³
          solar: instantPower * solarRatio,
        },
        totalPower: instantPower, // kW
        consumption: instantPower, // kWh (sur 1h)
      });
    }
  }

  return data;
};

// ========================================
// FONCTION : Générer données temps réel
// ========================================

/**
 * Génère des données temps réel simulées
 * @returns {Object} Données temps réel pour tous les sites
 */
export const generateRealtimeData = () => {
  return {
    site_paris: {
      instantPower: 380 + Math.random() * 100, // 380-480 kW
      dailyConsumption: 8500 + Math.random() * 1000, // kWh
      dailyCost: 1600 + Math.random() * 200, // €
      dailyCO2: 485 + Math.random() * 50, // kg
      utilizationRate: 0.75 + Math.random() * 0.15, // 75-90%
    },
    site_lyon: {
      instantPower: 520 + Math.random() * 80,
      dailyConsumption: 11000 + Math.random() * 1500,
      dailyCost: 2080 + Math.random() * 300,
      dailyCO2: 630 + Math.random() * 70,
      utilizationRate: 0.80 + Math.random() * 0.12,
    },
    site_marseille: {
      instantPower: 680 + Math.random() * 120,
      dailyConsumption: 14500 + Math.random() * 2000,
      dailyCost: 2740 + Math.random() * 400,
      dailyCO2: 830 + Math.random() * 90,
      utilizationRate: 0.82 + Math.random() * 0.10,
    },
    global: {
      instantPower: 1580 + Math.random() * 200,
      dailyConsumption: 34000 + Math.random() * 3000,
      dailyCost: 6420 + Math.random() * 600,
      dailyCO2: 1945 + Math.random() * 150,
      utilizationRate: 0.79 + Math.random() * 0.12,
    },
  };
};

// ========================================
// EXPORT PAR DÉFAUT
// ========================================

export default {
  sites,
  buildings,
  zones,
  equipments,
  generateConsumptionData,
  generateRealtimeData,
};