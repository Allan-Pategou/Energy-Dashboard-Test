import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatPower, formatPercentage } from '../../utils/formatters';
import { ENERGY_SOURCES } from '../../data/constants';

/**
 * Graphique circulaire du mix énergétique
 * @param {Array} data - Données du mix [{source, consumption, percentage}, ...]
 * @param {boolean} loading - État de chargement
 */
const EnergyMixPieChart = ({ data = [], loading = false }) => {
  // Préparation des données pour Recharts
  const chartData = data
    .filter(item => item.consumption > 0)
    .map(item => ({
      name: item.source.name,
      value: item.consumption,
      percentage: item.percentage,
      color: item.source.color,
      icon: item.source.icon,
    }));

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0];

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: data.payload.color }}
          ></div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {data.payload.icon} {data.name}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Consommation:</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatPower(data.value)}h
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Part:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {formatPercentage(data.payload.percentage / 100)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Label personnalisé sur le graphique
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    if (percentage < 5) return null; // Ne pas afficher si < 1%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  // État de chargement
  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Chargement du mix énergétique...</p>
        </div>
      </div>
    );
  }

  // Pas de données
  if (!data || data.length === 0 || chartData.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Aucune donnée disponible</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Le mix énergétique apparaîtra ici
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {entry.payload.icon} {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Statistiques sous le graphique */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {chartData.map((item, index) => (
          <div 
            key={index}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4"
            style={{ borderLeftColor: item.color }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.name}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPower(item.value)}h
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatPercentage(item.percentage / 100)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergyMixPieChart;