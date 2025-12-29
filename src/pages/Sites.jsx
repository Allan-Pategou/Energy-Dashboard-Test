import { useState, useEffect } from 'react';
import { Building2, MapPin, Zap, TrendingUp } from 'lucide-react';
import EntitySelector from '../components/navigation/EntitySelector';
import Breadcrumb from '../components/navigation/Breadcrumb';
import useEntityNavigation from '../hooks/useEntityNavigation';
import useDashboardData from '../hooks/useDashboardData';
import KPICard from '../components/dashboard/KPICard';
import { 
  fetchSites, 
  fetchBuildingsBySite, 
  fetchZonesByBuilding 
} from '../services/energyService';
import { formatPower, formatCost, formatCO2 } from '../utils/formatters';

const Sites = () => {
  const { currentEntity, navigationPath, navigateTo } = useEntityNavigation();
  const [sites, setSites] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Données pour l'entité courante
  const { 
    realtimeData, 
    variations,
    loading: dataLoading 
  } = useDashboardData(currentEntity.id, 7);

  // Chargement des entités selon le niveau
  useEffect(() => {
    loadEntities();
  }, [currentEntity]);

  const loadEntities = async () => {
    setLoading(true);
    try {
      if (currentEntity.type === 'global') {
        const result = await fetchSites();
        if (result.success) {
          setSites(result.data);
          setBuildings([]);
          setZones([]);
        }
      } else if (currentEntity.type === 'site') {
        const result = await fetchBuildingsBySite(currentEntity.id);
        if (result.success) {
          setBuildings(result.data);
          setSites([]);
          setZones([]);
        }
      } else if (currentEntity.type === 'building') {
        const result = await fetchZonesByBuilding(currentEntity.id);
        if (result.success) {
          setZones(result.data);
          setSites([]);
          setBuildings([]);
        }
      }
    } catch (error) {
      console.error('Erreur chargement entités:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntitySelect = (entity) => {
    navigateTo(entity);
  };

  const handleBreadcrumbNavigate = (entity) => {
    navigateTo(entity);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sites & Bâtiments
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Navigation dans la hiérarchie organisationnelle
        </p>
      </div>

      {/* Sélecteur d'entité */}
      <div className="card">
        <EntitySelector
          selectedEntity={currentEntity}
          onSelect={handleEntitySelect}
        />
      </div>

      {/* Breadcrumb */}
      {navigationPath.length > 1 && (
        <Breadcrumb 
          path={navigationPath} 
          onNavigate={handleBreadcrumbNavigate}
        />
      )}

      {/* KPIs de l'entité courante */}
      {realtimeData && !dataLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            title="Consommation"
            value={formatPower(realtimeData.instantPower)}
            variation={variations.avgPower}
            icon={Zap}
            iconColor="bg-blue-500"
            loading={dataLoading}
          />
          <KPICard
            title="Coût Journalier"
            value={formatCost(realtimeData.dailyCost)}
            variation={variations.cost}
            icon={TrendingUp}
            iconColor="bg-orange-500"
            loading={dataLoading}
          />
          <KPICard
            title="Émissions CO₂"
            value={formatCO2(realtimeData.dailyCO2)}
            variation={variations.co2}
            icon={TrendingUp}
            iconColor="bg-green-500"
            loading={dataLoading}
          />
        </div>
      )}

      {/* Liste des Sites */}
      {currentEntity.type === 'global' && sites.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Liste des Sites ({sites.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map(site => (
              <button
                key={site.id}
                onClick={() => navigateTo({ type: 'site', id: site.id, name: site.name })}
                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border-2 border-transparent hover:border-blue-500 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                    {site.buildings.length} bâtiments
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {site.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {site.location.city}, {site.location.country}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Surface: {site.area.toLocaleString()} m²
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste des Bâtiments */}
      {currentEntity.type === 'site' && buildings.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Bâtiments de {currentEntity.name} ({buildings.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildings.map(building => (
              <button
                key={building.id}
                onClick={() => navigateTo({ type: 'building', id: building.id, name: building.name })}
                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border-2 border-transparent hover:border-purple-500 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300">
                    {building.zones.length} zones
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {building.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Surface: {building.area.toLocaleString()} m²
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste des Zones */}
      {currentEntity.type === 'building' && zones.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Zones de {currentEntity.name} ({zones.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map(zone => (
              <div
                key={zone.id}
                className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border-2 border-transparent hover:border-green-500 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {zone.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Surface: {zone.area.toLocaleString()} m²
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* État de chargement */}
      {loading && (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sites;