import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatPower } from '../../utils/formatters';
import { ENERGY_SOURCES } from '../../data/constants';

/**
 * Graphique en barres pour comparer les bâtiments
 * @param {Array} data - Données [{name, consumption, cost, co2}, ...]
 * @param {string} metric - Métrique à afficher ('consumption', 'cost', 'co2')
 * @param {boolean} stacked - Empiler les sources d'énergie
 * @param {boolean} loading - État de chargement
 */
const BuildingComparisonBarChart = ({ 
  data = [], 
  metric = 'consumption',
  stacked = false,
  loading = false 
}) => {
  // Configuration des métriques
  const metricConfig = {
    consumption: {
      label: 'Consommation (kWh)',
      color: '#3B82F6',
      formatter: (value) => formatPower(value) + 'h',
    },
    cost: {
      label: 'Coût (€)',
      color: '#F59E0B',
      formatter: (value) => `${value.toFixed(0)} €`,
    },
    co2: {
      label: 'Émissions CO₂ (kg)',
      color: '#10B981',
      formatter: (value) => `${value.toFixed(0)} kg`,
    },
  };

  const config = metricConfig[metric] || metricConfig.consumption;

  // Tri des données par valeur décroissante
  const sortedData = [...data].sort((a, b) => b[metric] - a[metric]);

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {data.name}
        </p>
        <div className="space-y-1">
          {stacked ? (
            <>
              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ENERGY_SOURCES.electricity.color }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Électricité:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPower(data.electricity || 0)}h
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ENERGY_SOURCES.gas.color }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gaz:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPower(data.gas || 0)}h
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ENERGY_SOURCES.solar.color }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Solaire:</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPower(data.solar || 0)}h
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <div className="flex justify-between gap-4">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {config.formatter(data[metric])}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{config.label}:</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {config.formatter(data[metric])}
              </span>
            </div>
          )}
        </div>
      </div>
    );
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
            Les comparaisons apparaîtront ici
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-gray-200 dark:stroke-gray-700" 
          />
          
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            className="text-xs fill-gray-600 dark:fill-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          
          <YAxis 
            className="text-xs fill-gray-600 dark:fill-gray-400"
            tick={{ fill: 'currentColor' }}
            label={{ 
              value: config.label, 
              angle: -90, 
              position: 'insideLeft',
              className: 'fill-gray-600 dark:fill-gray-400'
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {stacked && <Legend />}

          {stacked ? (
            <>
              <Bar 
                dataKey="electricity" 
                stackId="a" 
                fill={ENERGY_SOURCES.electricity.color}
                name="Électricité"
              />
              <Bar 
                dataKey="gas" 
                stackId="a" 
                fill={ENERGY_SOURCES.gas.color}
                name="Gaz"
              />
              <Bar 
                dataKey="solar" 
                stackId="a" 
                fill={ENERGY_SOURCES.solar.color}
                name="Solaire"
              />
            </>
          ) : (
            <Bar dataKey={metric} radius={[8, 8, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={config.color}
                  opacity={1 - (index * 0.1)}
                />
              ))}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BuildingComparisonBarChart;