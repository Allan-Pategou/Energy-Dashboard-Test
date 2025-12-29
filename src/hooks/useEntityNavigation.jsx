import { useState, useEffect, useCallback } from 'react';
import { 
  fetchSites, 
  fetchSiteById, 
  fetchBuildingById,
  fetchBuildingsBySite 
} from '../services/energyService';

/**
 * Hook personnalisé pour gérer la navigation entre entités
 */
const useEntityNavigation = () => {
  const [currentEntity, setCurrentEntity] = useState({
    type: 'global',
    id: 'global',
    name: 'Tous les Sites'
  });
  
  const [navigationPath, setNavigationPath] = useState([
    { type: 'global', id: 'global', name: 'Tous les Sites' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Construit le chemin de navigation complet
   */
  const buildNavigationPath = useCallback(async (entity) => {
    const path = [{ type: 'global', id: 'global', name: 'Tous les Sites' }];

    try {
      if (entity.type === 'site') {
        path.push(entity);
      } else if (entity.type === 'building') {
        // Récupérer le bâtiment pour obtenir le siteId
        const buildingResult = await fetchBuildingById(entity.id);
        if (buildingResult.success) {
          const building = buildingResult.data;
          
          // Récupérer le site
          const siteResult = await fetchSiteById(building.siteId);
          if (siteResult.success) {
            path.push({
              type: 'site',
              id: siteResult.data.id,
              name: siteResult.data.name
            });
          }
        }
        path.push(entity);
      } else if (entity.type === 'zone') {
        // Pour les zones, on devrait idéalement récupérer zone → building → site
        // Simplifié pour l'instant
        path.push(entity);
      }

      return path;
    } catch (error) {
      console.error('Erreur construction chemin:', error);
      return path;
    }
  }, []);

  /**
   * Navigue vers une entité
   */
  const navigateTo = useCallback(async (entity) => {
    setLoading(true);
    setError(null);

    try {
      const path = await buildNavigationPath(entity);
      setCurrentEntity(entity);
      setNavigationPath(path);
    } catch (err) {
      setError(err.message);
      console.error('Erreur navigation:', err);
    } finally {
      setLoading(false);
    }
  }, [buildNavigationPath]);

  /**
   * Navigue vers le niveau global
   */
  const navigateToGlobal = useCallback(() => {
    const globalEntity = { type: 'global', id: 'global', name: 'Tous les Sites' };
    setCurrentEntity(globalEntity);
    setNavigationPath([globalEntity]);
  }, []);

  /**
   * Remonte d'un niveau dans la hiérarchie
   */
  const navigateUp = useCallback(() => {
    if (navigationPath.length > 1) {
      const parentEntity = navigationPath[navigationPath.length - 2];
      navigateTo(parentEntity);
    }
  }, [navigationPath, navigateTo]);

  return {
    currentEntity,
    navigationPath,
    loading,
    error,
    navigateTo,
    navigateToGlobal,
    navigateUp,
  };
};

export default useEntityNavigation;