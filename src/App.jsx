
function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard Énergétique
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Consommation
            </h3>
            <p className="text-3xl font-bold text-energy-low mt-2">450 kW</p>
          </div>
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Coût
            </h3>
            <p className="text-3xl font-bold text-energy-medium mt-2">1,250 €</p>
          </div>
          <div className="kpi-card">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              CO₂
            </h3>
            <p className="text-3xl font-bold text-energy-high mt-2">180 kg</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
