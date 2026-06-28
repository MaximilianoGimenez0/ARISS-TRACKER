// Imports
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Render

/**
 * Punto de entrada de la aplicación.
 * Inicializa React 18, monta el componente App en el nodo raíz del DOM
 * y activa el StrictMode para comprobaciones de ciclo de vida en desarrollo.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
