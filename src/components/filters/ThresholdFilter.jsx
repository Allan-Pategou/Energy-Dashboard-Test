import { useState, useRef, useEffect } from 'react';
import { Sliders, ChevronDown } from 'lucide-react';
import { formatPower } from '../../utils/formatters';

/**
 * Filtre par seuil de consommation
 * @param {number} minValue - Valeur minimale (kW)
 * @param {number} maxValue - Valeur maximale (kW)
 * @param {Function} onChange - Callback ({ min, max })
 */
const ThresholdFilter = ({ 
  minValue = 0, 
  maxValue = 1000, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMin, setTempMin] = useState(minValue);
  const [tempMax, setTempMax] = useState(maxValue);
  const dropdownRef = useRef(null);

  const absoluteMin = 0;
  const absoluteMax = 2000; // kW

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

  // Réinitialiser à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTempMin(minValue);
      setTempMax(maxValue);
    }
  }, [isOpen, minValue, maxValue]);

  // Appliquer les changements
  const handleApply = () => {
    onChange({ min: tempMin, max: tempMax });
    setIsOpen(false);
  };

  // Réinitialiser
  const handleReset = () => {
    setTempMin(absoluteMin);
    setTempMax(absoluteMax);
    onChange({ min: absoluteMin, max: absoluteMax });
    setIsOpen(false);
  };

  const isFiltered = minValue !== absoluteMin || maxValue !== absoluteMax;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg transition-colors
          ${isFiltered 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
          }
        `}
      >
        <Sliders className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Seuil
        </span>
        {isFiltered && (
          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
            1
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
          
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Filtrer par consommation
          </h3>

          {/* Affichage des valeurs */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Minimum</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPower(tempMin)}
              </p>
            </div>
            <div className="text-gray-400 dark:text-gray-600">—</div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Maximum</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPower(tempMax)}
              </p>
            </div>
          </div>

          {/* Slider minimum */}
          <div className="mb-4">
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Consommation minimale
            </label>
            <input
              type="range"
              min={absoluteMin}
              max={absoluteMax}
              value={tempMin}
              onChange={(e) => setTempMin(Math.min(Number(e.target.value), tempMax - 50))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Slider maximum */}
          <div className="mb-4">
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Consommation maximale
            </label>
            <input
              type="range"
              min={absoluteMin}
              max={absoluteMax}
              value={tempMax}
              onChange={(e) => setTempMax(Math.max(Number(e.target.value), tempMin + 50))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Presets rapides */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-semibold">
              Raccourcis
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setTempMin(0); setTempMax(300); }}
                className="px-3 py-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                Faible
                <br />
                <span className="text-[10px]">0-300 kW</span>
              </button>
              <button
                onClick={() => { setTempMin(300); setTempMax(800); }}
                className="px-3 py-2 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                Moyen
                <br />
                <span className="text-[10px]">300-800 kW</span>
              </button>
              <button
                onClick={() => { setTempMin(800); setTempMax(2000); }}
                className="px-3 py-2 text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Élevé
                <br />
                <span className="text-[10px]">800+ kW</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleReset}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Réinitialiser
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThresholdFilter;