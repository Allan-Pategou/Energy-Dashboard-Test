import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatPower } from '../../utils/formatters';
import { ENERGY_SOURCES } from '../../data/constants';

/**
 * Graphique de consommation énergétique avec Recharts
 * @param {Array} data - Données de consommation
 * @param {boolean} showSources - Afficher les sources individuelles
 * @param {string} timeFormat - Format de temps ('hour', 'day', 'month')
 * @param {boolean} loading - État de chargement
 */
const ConsumptionLineChart = ({ 
  data = [], 
  showSources = true,
  timeFormat = 'hour',
  loading = false,
}) => {
  /**
   * Agrège les données par jour pour éviter les répétitions
   */
  const aggregateDataByDay = (rawData) => {
    const grouped = {};
    
    rawData.forEach(item => {
      const date = format(new Date(item.timestamp), 'yyyy-MM-dd');
      
      if (!grouped[date]) {
        grouped[date] = {
          timestamp: item.timestamp,
          total: 0,
          electricity: 0,
          gas: 0,
          solar: 0,
          count: 0,
        };
      }
      
      grouped[date].total += item.totalPower || 0;
      grouped[date].electricity += item.sources?.electricity || 0;
      grouped[date].gas += item.sources?.gas ? item.sources.gas * 10.3 : 0;
      grouped[date].solar += item.sources?.solar || 0;
      grouped[date].count += 1;
    });
    
    // Calculer les moyennes
    return Object.values(grouped).map(day => ({
      timestamp: day.timestamp,
      total: day.total / day.count,
      electricity: day.electricity / day.count,
      gas: day.gas / day.count,
      solar: day.solar / day.count,
    }));
  };

  /**
   * Échantillonne les données pour éviter trop de points
   */
  const sampleData = (rawData, maxPoints = 50) => {
    if (rawData.length <= maxPoints) return rawData;
    
    const step = Math.ceil(rawData.length / maxPoints);
    return rawData.filter((_, index) => index % step === 0);
  };

  // Préparation des données selon le format
  let processedData = data;
  
  if (timeFormat === 'day' && data.length > 24) {
    // Pour 7 ou 30 jours : agréger par jour
    processedData = aggregateDataByDay(data);
  } else if (timeFormat === 'hour' && data.length > 24) {
    // Pour aujourd'hui : échantillonner si trop de points
    processedData = sampleData(data, 24);
  }

  // Formatage des données pour Recharts
  const formattedData = processedData.map(item => {
    const timestamp = new Date(item.timestamp);
    
    let timeLabel;
    switch (timeFormat) {
      case 'hour':
        timeLabel = format(timestamp, 'HH:mm', { locale: fr });
        break;
      case 'day':
        timeLabel = format(timestamp, 'dd/MM', { locale: fr });
        break;
      case 'month':
        timeLabel = format(timestamp, 'MMM', { locale: fr });
        break;
      default:
        timeLabel = format(timestamp, 'HH:mm', { locale: fr });
    }

    return {
      time: timeLabel,
      timestamp: item.timestamp,
      total: item.totalPower || item.total || 0,
      electricity: item.sources?.electricity || item.electricity || 0,
      gas: item.sources?.gas ? item.sources.gas * 10.3 : item.gas || 0,
      solar: item.sources?.solar || item.solar || 0,
    };
  });

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const timestamp = new Date(data.timestamp);
    
    // Format selon le type de période
    let dateFormat;
    switch (timeFormat) {
      case 'hour':
        dateFormat = 'dd MMMM yyyy à HH:mm';
        break;
      case 'day':
        dateFormat = 'dd MMMM yyyy';
        break;
      case 'month':
        dateFormat = 'MMMM yyyy';
        break;
      default:
        dateFormat = 'dd MMMM yyyy à HH:mm';
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {format(timestamp, dateFormat, { locale: fr })}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatPower(data.total)}
            </span>
          </div>
          {showSources && (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ENERGY_SOURCES.electricity.color }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Électricité:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPower(data.electricity)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ENERGY_SOURCES.gas.color }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gaz:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPower(data.gas)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ENERGY_SOURCES.solar.color }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Solaire:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPower(data.solar)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Formateur d'axe X personnalisé pour éviter les répétitions
  const formatXAxis = (value, index) => {
    // Afficher tous les labels pour "Aujourd'hui" (peu de points)
    if (timeFormat === 'hour') {
      return value;
    }
    
    // Pour 7 jours : afficher tous les jours
    if (timeFormat === 'day' && formattedData.length <= 10) {
      return value;
    }
    
    // Pour 30 jours : afficher 1 label sur 3
    if (timeFormat === 'day' && formattedData.length > 10) {
      return index % 3 === 0 ? value : '';
    }
    
    return value;
  };

  // État de chargement
  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Chargement du graphique...</p>
        </div>
      </div>
    );
  }

  // Pas de données
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Aucune donnée disponible</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Les données de consommation apparaîtront ici
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-gray-200 dark:stroke-gray-700" 
          />
          
          <XAxis 
            dataKey="time" 
            className="text-xs fill-gray-600 dark:fill-gray-400"
            tick={{ fill: 'currentColor' }}
            tickFormatter={formatXAxis}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          
          <YAxis 
            className="text-xs fill-gray-600 dark:fill-gray-400"
            tick={{ fill: 'currentColor' }}
            label={{ 
              value: 'Puissance (kW)', 
              angle: -90, 
              position: 'insideLeft',
              className: 'fill-gray-600 dark:fill-gray-400'
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
            }}
            iconType="line"
          />

          {/* Ligne totale */}
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#3B82F6" 
            strokeWidth={3}
            name="Total"
            dot={false}
            activeDot={{ r: 6 }}
          />

          {/* Lignes par source (si activé) */}
          {showSources && (
            <>
              <Line 
                type="monotone" 
                dataKey="electricity" 
                stroke={ENERGY_SOURCES.electricity.color}
                strokeWidth={2}
                name="Électricité"
                dot={false}
                strokeDasharray="5 5"
              />
              
              <Line 
                type="monotone" 
                dataKey="gas" 
                stroke={ENERGY_SOURCES.gas.color}
                strokeWidth={2}
                name="Gaz"
                dot={false}
                strokeDasharray="5 5"
              />
              
              <Line 
                type="monotone" 
                dataKey="solar" 
                stroke={ENERGY_SOURCES.solar.color}
                strokeWidth={2}
                name="Solaire"
                dot={false}
                strokeDasharray="5 5"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionLineChart;