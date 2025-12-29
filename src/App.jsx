import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Comparison from './pages/Comparison';
import Sites from './pages/Sites';
import TestServices from './pages/TestServices';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="comparison" element={<Comparison />} />
          <Route path="sites" element={<Sites />} />
          <Route path="settings" element={
            <div className="card">
              <p className="text-gray-600 dark:text-gray-400">
                Page Paramètres - À développer (Jour 11)
              </p>
            </div>
          } />
          <Route path="test" element={<TestServices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;