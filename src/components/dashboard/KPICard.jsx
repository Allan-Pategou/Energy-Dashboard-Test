import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatVariation } from '../../utils/formatters';

/**
 * Composant de carte KPI avec valeur, variation et tendance
 * @param {string} title - Titre du KPI
 * @param {string} value - Valeur principale formatée
 * @param {number} variation - Variation en % (peut être négatif)
 * @param {string} comparisonText - Texte de comparaison (ex: "vs hier")
 * @param {ReactNode} icon - Icône du KPI
 * @param {string} iconColor - Couleur de l'icône
 * @param {boolean} inverseColors - Inverse les couleurs (vert=hausse, rouge=baisse)
 * @param {string} subtitle - Sous-titre optionnel
 * @param {boolean} loading - État de chargement
 */
const KPICard = ({ 
  title, 
  value, 
  variation = 0,
  comparisonText = 'vs période précédente',
  icon: Icon,
  iconColor = 'bg-blue-500',
  inverseColors = false,
  subtitle = null,
  loading = false,
}) => {
  // Calcul de la variation formatée
  const variationFormatted = formatVariation(variation, inverseColors);
  
  // Détermination de l'icône de tendance
  const getTrendIcon = () => {
    const absVariation = Math.abs(variation);
    
    if (absVariation < 1) {
      return <Minus className="w-4 h-4" />;
    }
    
    return variation > 0 
      ? <TrendingUp className="w-4 h-4" />
      : <TrendingDown className="w-4 h-4" />;
  };

  // État de chargement
  if (loading) {
    return (
      <div className="kpi-card animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="kpi-card hover:scale-105 transition-transform cursor-pointer group">
      {/* En-tête avec titre et icône */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {title}
        </h3>
        
        {Icon && (
          <div className={`${iconColor} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Valeur principale */}
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Variation et comparaison */}
      <div className="flex items-center gap-2 text-sm">
        <div className={`flex items-center gap-1 font-semibold ${variationFormatted.color}`}>
          {getTrendIcon()}
          <span>{variationFormatted.text}</span>
        </div>
        <span className="text-gray-500 dark:text-gray-400">
          {comparisonText}
        </span>
      </div>
    </div>
  );
};

export default KPICard;