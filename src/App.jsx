import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Comparison from './pages/Comparison';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="comparison" element={<Comparison />} />
          <Route path="sites" element={
            <div className="card">
              <p className="text-gray-600 dark:text-gray-400">
                Page Sites & Bâtiments - À développer (Jour 6)
              </p>
            </div>
          } />
          <Route path="settings" element={
            <div className="card">
              <p className="text-gray-600 dark:text-gray-400">
                Page Paramètres - À développer (Jour 11)
              </p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;