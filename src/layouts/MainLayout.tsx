// Imports
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FiMenu, FiActivity } from 'react-icons/fi';

import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import styles from './MainLayout.module.css';

// Componente principal

/**
 * MainLayout: Estructura contenedora principal de la aplicación Single Page (SPA).
 * Gestiona el marco visual general, incluyendo la barra de navegación lateral,
 * el pie de página y la zona central dinámica (Outlet) para las rutas.
 * Adicionalmente, incluye una secuencia de arranque (Boot Sequence) simulada al inicio.
 */
const MainLayout = () => {
  // Valores derivados
  const location = useLocation();

  // Estados
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Estados de simulación de arranque (Boot Sequence)
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // Effects

  /**
   * Efecto de simulación de arranque inicial del sistema (Boot Sequence).
   * Muestra progresivamente un log técnico falso emulando la conexión satelital
   * a la red NORAD y a las estaciones terrenas antes de renderizar la aplicación real.
   */
  useEffect(() => {
    const logs = [
      '[SYSTEM] Booting sat-telemetry subsystems v4.8.2...',
      '[SATLINK] Connecting to NORAD satellite database...',
      '[TLE-ENG] Initializing SGP4 orbital propagation...',
      '[GROUND] Connecting to 10 active SDR ground stations...',
      '[MAPS] Rendering 3D Earth topology projection...',
      '[ISS] Synchronizing telemetry parameters: Alt 420km...',
      '[MISSION] SatComm link established. Welcome to Mission Control.'
    ];

    let currentStep = 0;
    
    // Temporizador que imprime línea por línea los logs de inicio
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setBootLogs((prev) => [...prev, logs[currentStep]]);
        setBootProgress(Math.round(((currentStep + 1) / logs.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Transición de salida: quita la pantalla de boot tras una breve pausa final
        const timeout = setTimeout(() => {
          setIsBooting(false);
        }, 800);
        
        return () => clearTimeout(timeout);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  // Render

  // Renderizado temprano (Early return) de la Pantalla de Arranque
  if (isBooting) {
    return (
      <div className={styles.bootOverlay}>
        <div className={styles.bootTerminal}>
          <header className={styles.bootHeader}>
            <FiActivity className={styles.bootLogo} />
            
            <div className={styles.bootTitleContainer}>
              <span className={styles.bootTitle}>SDR - ISS SIGNAL_TRACKING</span>
              <span className={styles.bootSubtitle}>Mission Control v4.8.2</span>
            </div>
          </header>

          <div className={styles.bootConsole}>
            {bootLogs.map((log, idx) => {
              const isSuccess =
                typeof log === 'string' &&
                (log.includes('established') || log.includes('nominal'));
                
              return (
                <div
                  key={idx}
                  className={`${styles.consoleLine} ${isSuccess ? styles.consoleLineSuccess : ''}`}
                >
                  {log}
                </div>
              );
            })}
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${bootProgress}%` }}
              />
            </div>
            
            <div className={styles.progressText}>
              <span>System Initialization</span>
              <span className={styles.progressVal}>{bootProgress}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado principal de la aplicación post-arranque
  return (
    <div className={styles.layoutContainer}>
      
      {/* Barra de Navegación Lateral (Sidebar) */}
      <Navbar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Contenedor central principal que se ajusta a la barra lateral */}
      <div
        className={`${styles.contentContainer} ${isSidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed}`}
      >
        {/* Cabecera Móvil (sólo visible en pantallas pequeñas <= 768px) */}
        <header className={styles.mobileHeader}>
          <button
            className={styles.menuBtn}
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu />
          </button>
          
          <span className={styles.mobileTitle}>Sat-Telemetry Control</span>
          
          {/* Espaciador invisible para balancear visualmente el botón de menú */}
          <div style={{ width: '24px' }} />
        </header>

        {/* Zona dinámica (Outlet) inyectada por React Router DOM */}
        <main className={styles.mainContent}>
          <div key={location.pathname} className={styles.pageTransition}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Pie de Página con métricas estáticas */}
      <Footer isExpanded={isSidebarExpanded} />
    </div>
  );
};

export default MainLayout;
