import { useState, useRef, useEffect } from 'react';
import { Filter, Check, ChevronDown } from 'lucide-react';
import { ENERGY_SOURCES } from '../../data/constants';

/**
 * Filtre multi-sélection des sources d'énergie
 * @param {Array} selectedSources - IDs des sources sélectionnées
 * @param {Function} onChange - Callback avec array d'IDs
 */
const EnergySourceFilter = ({ selectedSources = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sources = Object.values(ENERGY_SOURCES);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle une source
  const toggleSource = (sourceId) => {
    if (selectedSources.includes(sourceId)) {
      onChange(selectedSources.filter(id => id !== sourceId));
    } else {
      onChange([...selectedSources, sourceId]);
    }
  };

  // Sélectionner tout
  const selectAll = () => {
    onChange(sources.map(s => s.id));
  };

  // Désélectionner tout
  const deselectAll = () => {
    onChange([]);
  };

  const selectedCount = selectedSources.length;
  const allSelected = selectedCount === sources.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors"
      >
        <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Sources d'énergie
        </span>
        {selectedCount > 0 && selectedCount < sources.length && (
          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
            {selectedCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-3">
          
          {/* Actions rapides */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Sélection
            </span>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                disabled={allSelected}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:no-underline"
              >
                Tout
              </button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button
                onClick={deselectAll}
                disabled={selectedCount === 0}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:no-underline"
              >
                Aucun
              </button>
            </div>
          </div>

          {/* Liste des sources */}
          <div className="space-y-2">
            {sources.map(source => {
              const isSelected = selectedSources.includes(source.id);
              
              return (
                <button
                  key={source.id}
                  onClick={() => toggleSource(source.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  {/* Checkbox custom */}
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                    ${isSelected 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-gray-300 dark:border-gray-600'
                    }
                  `}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Couleur de la source */}
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />

                  {/* Nom et émoji */}
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-lg">{source.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {source.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer avec compteur */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              {selectedCount === 0 && 'Aucune source sélectionnée'}
              {selectedCount === sources.length && 'Toutes les sources sélectionnées'}
              {selectedCount > 0 && selectedCount < sources.length && 
                `${selectedCount} source${selectedCount > 1 ? 's' : ''} sélectionnée${selectedCount > 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergySourceFilter;