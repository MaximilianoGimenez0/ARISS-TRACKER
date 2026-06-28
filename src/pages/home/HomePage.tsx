// Imports
import SdrGlobe from '@/components/sdr-globe/SdrGlobe';
import styles from './HomePage.module.css';

// Componente principal

/**
 * HomePage: Vista principal de la aplicación.
 * Actúa como contenedor de alto nivel para montar el globo terráqueo 3D interactivo
 * (SdrGlobe) que maneja toda la lógica del rastreo y visualización.
 */
const HomePage = () => {
  
  // Render
  return (
    <div className={styles.container}>
      <SdrGlobe />
    </div>
  );
};

export default HomePage;
