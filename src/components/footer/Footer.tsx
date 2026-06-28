// Imports
import styles from './Footer.module.css';

// Tipos e interfaces

/**
 * Propiedades del componente Footer.
 */
interface FooterProps {
  /** Indica si la barra lateral izquierda está expandida, para ajustar el margen. */
  isExpanded: boolean;
}

// Componente principal

/**
 * Footer: Componente decorativo situado en la parte inferior de la pantalla principal.
 * Muestra el estado del sistema y los créditos. Su posición se ajusta dinámicamente
 * dependiendo del ancho ocupado por la barra lateral de navegación (Navbar).
 */
const Footer = ({ isExpanded }: FooterProps) => {

  // Render
  return (
    <footer
      className={styles.footer}
      style={{
        left: isExpanded ? '240px' : '80px',
      }}
    >
      <div className={styles.footerLeft}>
        <div className={styles.statusIndicator}>
          {/* Indicador visual de estado verde/parpadeante mediante CSS */}
          <span className={styles.statusDot} />
          <span>SYS ACTIVE // NOMINAL</span>
        </div>
      </div>
      
      <div className={styles.footerRight}>
        <span>© 2026 Maximiliano Giménez</span>
      </div>
    </footer>
  );
};

export default Footer;
