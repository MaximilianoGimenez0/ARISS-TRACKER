// Imports
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import TrackerPage from '@/pages/tracker/TrackerPage';
import InfoPage from '@/pages/info/InfoPage';

// Componente principal

/**
 * AppRouter: Gestor de rutas de la aplicación Single Page (SPA).
 * Utiliza React Router v6 para inyectar dinámicamente las páginas
 * dentro del MainLayout sin recargar el navegador.
 */
const AppRouter = () => {
  // Render
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Ruta base (Index) */}
          <Route index element={<InfoPage />} />

          {/* Ruta de información técnica */}
          <Route path="tracker" element={<TrackerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
