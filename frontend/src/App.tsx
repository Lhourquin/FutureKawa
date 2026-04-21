import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AlertsPage } from './pages/AlertsPage';
import { CountriesPage } from './pages/CountriesPage';
import { LoginPage } from './pages/LoginPage';
import { LotDetailPage } from './pages/LotDetailPage';
import { LotsPage } from './pages/LotsPage';
import { StockManagePage } from './pages/StockManagePage';
import { WarehousesPage } from './pages/WarehousesPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('fk_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/countries" replace />} />
                <Route path="/countries" element={<CountriesPage />} />
                <Route path="/countries/:countryCode/lots" element={<LotsPage />} />
                <Route path="/countries/:countryCode/warehouses" element={<WarehousesPage />} />
                <Route path="/countries/:countryCode/manage" element={<StockManagePage />} />
                <Route path="/lots/:lotId" element={<LotDetailPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
              </Routes>
            </Layout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
