// Imports
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/home/HomePage.tsx';
import InfoPage from '@/pages/info/InfoPage.tsx';

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
          <Route index element={<HomePage />} />
          
          {/* Ruta de información técnica */}
          <Route path="info" element={<InfoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
