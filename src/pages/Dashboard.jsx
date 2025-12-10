import { TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* En-tête de page */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Principal
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vue d'ensemble de la consommation énergétique
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Consommation Instantanée */}
        <div className="kpi-card hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Consommation Instantanée
            </h3>
            <TrendingDown className="w-4 h-4 text-energy-low" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            450 <span className="text-lg font-normal">kW</span>
          </p>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-energy-low font-semibold">↓ 5.2%</span>
            <span className="text-gray-500 dark:text-gray-400">vs hier</span>
          </div>
        </div>

        {/* KPI 2 : Coût Journalier */}
        <div className="kpi-card hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Coût Journalier Estimé
            </h3>
            <TrendingUp className="w-4 h-4 text-energy-medium" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            1,250 <span className="text-lg font-normal">€</span>
          </p>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-energy-medium font-semibold">↑ 2.8%</span>
            <span className="text-gray-500 dark:text-gray-400">vs hier</span>
          </div>
        </div>

        {/* KPI 3 : Émissions CO₂ */}
        <div className="kpi-card hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Émissions CO₂
            </h3>
            <TrendingDown className="w-4 h-4 text-energy-low" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            180 <span className="text-lg font-normal">kg</span>
          </p>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-energy-low font-semibold">↓ 8.1%</span>
            <span className="text-gray-500 dark:text-gray-400">vs hier</span>
          </div>
        </div>

        {/* KPI 4 : Taux d'Utilisation */}
        <div className="kpi-card hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Taux d'Utilisation
            </h3>
            <TrendingUp className="w-4 h-4 text-energy-high" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            78 <span className="text-lg font-normal">%</span>
          </p>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-energy-high font-semibold">↑ 12.3%</span>
            <span className="text-gray-500 dark:text-gray-400">vs hier</span>
          </div>
        </div>
      </div>

      {/* Section Graphique (placeholder) */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Consommation sur 24h
        </h2>
        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Graphique à venir (Jour 4-5)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;