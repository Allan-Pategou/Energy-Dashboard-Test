import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * KPI Temps Réel avec animation lors des changements
 * @param {string} label - Label du KPI
 * @param {string|number} value - Valeur actuelle
 * @param {string} unit - Unité (kW, €, kg, etc.)
 * @param {number} trend - Tendance (-1, 0, 1)
 * @param {string} color - Couleur (blue, green, orange, red)
 * @param {ReactNode} icon - Icône
 */
const RealTimeKPI = ({ 
  label, 
  value, 
  unit = '', 
  trend = 0,
  color = 'blue',
  icon: Icon 
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  // Détecter les changements de valeur
  useEffect(() => {
    if (value !== prevValue) {
      setIsUpdating(true);
      setPrevValue(value);
      
      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  // Couleurs selon la tendance
  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600 dark:text-green-400';
    if (trend < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  // Couleurs du fond selon le type
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className={`
      relative overflow-hidden rounded-xl p-6 
      bg-gradient-to-br ${colorClasses[color]} 
      text-white shadow-lg
      ${isUpdating ? 'ring-4 ring-white/50 dark:ring-gray-800/50' : ''}
      transition-all duration-300
    `}>
      {/* Animation de flash lors de la mise à jour */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      )}

      <div className="relative z-10">
        {/* En-tête avec icône */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium opacity-90 uppercase tracking-wide">
            {label}
          </span>
          {Icon && (
            <div className="p-2 bg-white/20 rounded-lg">
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Valeur principale */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className={`
              text-4xl font-bold 
              ${isUpdating ? 'scale-110' : 'scale-100'}
              transition-transform duration-300
            `}>
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            {unit && (
              <span className="text-xl font-medium opacity-80">
                {unit}
              </span>
            )}
          </div>
        </div>

        {/* Tendance */}
        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-semibold">
            {Math.abs(trend).toFixed(1)}%
          </span>
          <span className="text-sm opacity-75">vs 1 min</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeKPI;