import { useState, useEffect } from 'react';
import { Building2, Home, MapPin, ChevronDown } from 'lucide-react';
import { fetchSites, fetchBuildingsBySite, fetchZonesByBuilding } from '../../services/energyService';

/**
 * Sélecteur d'entité cascadé : Site → Bâtiment → Zone
 * @param {Object} selectedEntity - Entité sélectionnée { type, id, name }
 * @param {Function} onSelect - Callback lors de la sélection
 */
const EntitySelector = ({ selectedEntity, onSelect }) => {
  const [sites, setSites] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Chargement initial des sites
  useEffect(() => {
    loadSites();
  }, []);

  // Chargement des bâtiments quand un site est sélectionné
  useEffect(() => {
    if (selectedEntity?.type === 'site' && selectedEntity?.id !== 'global') {
      loadBuildings(selectedEntity.id);
    } else {
      setBuildings([]);
      setZones([]);
    }
  }, [selectedEntity]);

  const loadSites = async () => {
    setLoading(true);
    try {
      const result = await fetchSites();
      if (result.success) {
        setSites(result.data);
      }
    } catch (error) {
      console.error('Erreur chargement sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBuildings = async (siteId) => {
    setLoading(true);
    try {
      const result = await fetchBuildingsBySite(siteId);
      if (result.success) {
        setBuildings(result.data);
      }
    } catch (error) {
      console.error('Erreur chargement bâtiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadZones = async (buildingId) => {
    setLoading(true);
    try {
      const result = await fetchZonesByBuilding(buildingId);
      if (result.success) {
        setZones(result.data);
      }
    } catch (error) {
      console.error('Erreur chargement zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSiteChange = (e) => {
    const siteId = e.target.value;
    
    if (siteId === 'global') {
      onSelect({ type: 'global', id: 'global', name: 'Tous les Sites' });
      setBuildings([]);
      setZones([]);
    } else {
      const site = sites.find(s => s.id === siteId);
      if (site) {
        onSelect({ type: 'site', id: site.id, name: site.name });
      }
    }
  };

  const handleBuildingChange = async (e) => {
    const buildingId = e.target.value;
    
    if (buildingId === '') {
      // Retour au site
      const site = sites.find(s => s.id === selectedEntity?.id);
      if (site) {
        onSelect({ type: 'site', id: site.id, name: site.name });
      }
      setZones([]);
    } else {
      const building = buildings.find(b => b.id === buildingId);
      if (building) {
        onSelect({ type: 'building', id: building.id, name: building.name });
        await loadZones(buildingId);
      }
    }
  };

  const handleZoneChange = (e) => {
    const zoneId = e.target.value;
    
    if (zoneId === '') {
      // Retour au bâtiment
      const building = buildings.find(b => b.id === selectedEntity?.id);
      if (building) {
        onSelect({ type: 'building', id: building.id, name: building.name });
      }
    } else {
      const zone = zones.find(z => z.id === zoneId);
      if (zone) {
        onSelect({ type: 'zone', id: zone.id, name: zone.name });
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Sélecteur de Site */}
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Home className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <select
          value={selectedEntity?.type === 'global' ? 'global' : selectedEntity?.id || 'global'}
          onChange={handleSiteChange}
          disabled={loading}
          className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 appearance-none"
        >
          <option value="global">Tous les Sites</option>
          {sites.map(site => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
      </div>

      {/* Sélecteur de Bâtiment (visible si un site est sélectionné) */}
      {selectedEntity?.type !== 'global' && buildings.length > 0 && (
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={selectedEntity?.type === 'building' || selectedEntity?.type === 'zone' ? selectedEntity?.id : ''}
            onChange={handleBuildingChange}
            disabled={loading}
            className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 appearance-none"
          >
            <option value="">Tous les Bâtiments</option>
            {buildings.map(building => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>
      )}

      {/* Sélecteur de Zone (visible si un bâtiment est sélectionné) */}
      {selectedEntity?.type === 'building' && zones.length > 0 && (
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={selectedEntity?.type === 'zone' ? selectedEntity?.id : ''}
            onChange={handleZoneChange}
            disabled={loading}
            className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 appearance-none"
          >
            <option value="">Toutes les Zones</option>
            {zones.map(zone => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default EntitySelector;