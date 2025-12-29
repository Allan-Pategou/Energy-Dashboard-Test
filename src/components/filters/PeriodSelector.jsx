import { Calendar, ChevronDown } from 'lucide-react';

/**
 * Sélecteur de période pour les graphiques
 * @param {string} period - Période sélectionnée ('today', '7d', '30d')
 * @param {function} onChange - Callback lors du changement
 */
const PeriodSelector = ({ period = '7d', onChange }) => {
  const periods = [
    { id: 'today', label: "Aujourd'hui", days: 1 },
    { id: '7d', label: '7 derniers jours', days: 7 },
    { id: '30d', label: '30 derniers jours', days: 30 },
  ];

  const selectedPeriod = periods.find(p => p.id === period) || periods[1];

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:border-blue-500 transition-colors">
        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <select
          value={period}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-sm font-medium text-gray-900 dark:text-white focus:outline-none cursor-pointer pr-6"
          style={{ 
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none'
          }}
        >
          {periods.map(p => (
            <option 
              key={p.id} 
              value={p.id}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {p.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute right-3 pointer-events-none" />
      </div>
    </div>
  );
};

export default PeriodSelector;