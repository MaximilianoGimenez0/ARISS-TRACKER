// Imports
import SdrGlobe from '@/components/sdr-globe/SdrGlobe';
import styles from './TrackerPage.module.css';

// Componente principal

/**
 * HomePage: Vista principal de la aplicación.
 * Actúa como contenedor de alto nivel para montar el globo terráqueo 3D interactivo
 * (SdrGlobe) que maneja toda la lógica del rastreo y visualización.
 */
const TrackerPage = () => {

  // Render
  return (
    <div className={styles.container}>
      <SdrGlobe />
    </div>
  );
};

export default TrackerPage;
