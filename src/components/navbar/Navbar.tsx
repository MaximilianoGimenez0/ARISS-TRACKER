// Imports
import { NavLink } from 'react-router-dom';
import { FiGlobe, FiChevronsLeft, FiChevronsRight, FiX, FiActivity, FiInfo } from 'react-icons/fi';

import styles from './Navbar.module.css';

// Tipos e interfaces

/**
 * Propiedades del componente Navbar.
 */
interface NavbarProps {
  /** Indica si la barra lateral está expandida en pantallas grandes. */
  isExpanded: boolean;
  /** Función para actualizar el estado de expansión de la barra lateral. */
  setIsExpanded: (expanded: boolean) => void;
  /** Indica si el menú hamburguesa está abierto en pantallas móviles. */
  isMobileOpen: boolean;
  /** Función para actualizar el estado de apertura del menú móvil. */
  setIsMobileOpen: (open: boolean) => void;
}

// Componente principal

/**
 * Navbar: Barra de navegación lateral que permite cambiar entre secciones de la aplicación.
 * Posee un comportamiento responsivo (colapsable en escritorio, modal en móviles).
 */
const Navbar = ({ isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }: NavbarProps) => {

  // Funciones auxiliares / Event Handlers

  /** Alterna la expansión de la barra lateral en escritorio. */
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  /** Cierra el menú lateral en la vista móvil. */
  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  /**
   * Determina la clase CSS activa o inactiva para los enlaces de navegación (NavLinks).
   * @param param0 Contiene la información de si el NavLink coincide con la URL actual.
   * @returns Un string con la lista de clases aplicables.
   */
  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `${styles.link} ${isActive ? styles.linkActive : ''}`;


  // Render
  return (
    <>
      {/* 
        Fondo oscuro translúcido para móviles. 
        Al hacer click fuera del menú lateral, este se cerrará automáticamente.
      */}
      {isMobileOpen && (
        <div className={styles.backdrop} onClick={closeMobileSidebar} />
      )}

      <aside
        className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed} ${isMobileOpen ? styles.mobileOpen : ''}`}
      >
        {/* Botón de cierre superior (Sólo visible en móviles) */}
        <button
          className={styles.closeBtn}
          onClick={closeMobileSidebar}
          aria-label="Close menu"
        >
          <FiX />
        </button>

        {/* Encabezado con Logo y Marca */}
        <div className={styles.brand}>
          <FiActivity className={styles.logoIcon} />
          <span className={styles.brandText}>ARISS TRACKER</span>
        </div>

        {/* Enlaces de Rutas */}
        <nav className={styles.nav}>
          <NavLink to="/" className={linkClassName} onClick={closeMobileSidebar}>
            <FiGlobe className={styles.linkIcon} />
            <span className={styles.linkText}>Tracker</span>
          </NavLink>
          
          <NavLink to="/info" className={linkClassName} onClick={closeMobileSidebar}>
            <FiInfo className={styles.linkIcon} />
            <span className={styles.linkText}>Info</span>
          </NavLink>
        </nav>

        {/* 
          Control de expansión inferior (Sólo visible en escritorio). 
          Permite colapsar la barra lateral para ganar espacio visual del mapa.
        */}
        <div className={styles.controls}>
          <button
            className={styles.toggleBtn}
            onClick={toggleSidebar}
            aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}
          >
            {isExpanded ? <FiChevronsLeft /> : <FiChevronsRight />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
