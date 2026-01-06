import { X } from 'lucide-react';
import EnergySourceFilter from './EnergySourceFilter';
import ThresholdFilter from './ThresholdFilter';
import { ENERGY_SOURCES } from '../../data/constants';

/**
 * Barre de filtres globale réutilisable
 * @param {Object} filters - État des filtres
 * @param {Function} onFiltersChange - Callback de mise à jour des filtres
 */
const FilterBar = ({ filters, onFiltersChange }) => {
  // Compter les filtres actifs
  const getActiveFiltersCount = () => {
    let count = 0;
    
    // Vérifier les sources (si pas toutes sélectionnées)
    const allSources = Object.keys(ENERGY_SOURCES);
    if (filters.sources.length > 0 && filters.sources.length < allSources.length) {
      count++;
    }
    
    // Vérifier le seuil (si différent des valeurs par défaut)
    if (filters.threshold.min !== 0 || filters.threshold.max !== 2000) {
      count++;
    }
    
    return count;
  };

  const activeCount = getActiveFiltersCount();

  // Réinitialiser tous les filtres
  const handleResetAll = () => {
    const defaultFilters = {
      sources: Object.keys(ENERGY_SOURCES),
      threshold: {
        min: 0,
        max: 2000,
      },
    };
    
    onFiltersChange(defaultFilters);
  };

  // Badges des filtres actifs
  const getActiveFilterBadges = () => {
    const badges = [];
    
    // Sources
    const allSources = Object.keys(ENERGY_SOURCES);
    if (filters.sources.length > 0 && filters.sources.length < allSources.length) {
      badges.push({
        label: `${filters.sources.length} source${filters.sources.length > 1 ? 's' : ''}`,
        onRemove: () => onFiltersChange({ 
          ...filters, 
          sources: allSources 
        }),
      });
    }
    
    // Seuil
    if (filters.threshold.min !== 0 || filters.threshold.max !== 2000) {
      badges.push({
        label: `${filters.threshold.min}-${filters.threshold.max} kW`,
        onRemove: () => onFiltersChange({ 
          ...filters, 
          threshold: { min: 0, max: 2000 } 
        }),
      });
    }
    
    return badges;
  };

  const filterBadges = getActiveFilterBadges();

  return (
    <div className="space-y-3">
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <EnergySourceFilter
          selectedSources={filters.sources}
          onChange={(sources) => onFiltersChange({ ...filters, sources })}
        />

        <ThresholdFilter
          minValue={filters.threshold.min}
          maxValue={filters.threshold.max}
          onChange={(threshold) => onFiltersChange({ ...filters, threshold })}
        />

        {activeCount > 0 && (
          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Badges des filtres actifs */}
      {filterBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Filtres actifs:
          </span>
          {filterBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
            >
              <span>{badge.label}</span>
              <button
                onClick={badge.onRemove}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;