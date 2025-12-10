const Monitoring = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Monitoring Temps Réel
          </h1>
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse-slow">
            LIVE
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Surveillance en temps réel de la consommation énergétique
        </p>
      </div>

      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">
          Page Monitoring - À développer (Jour 10)
        </p>
      </div>
    </div>
  );
};

export default Monitoring;