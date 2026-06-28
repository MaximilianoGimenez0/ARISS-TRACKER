// Imports
import { useState } from 'react';
import { FiRadio, FiCopy, FiCheck } from 'react-icons/fi';

import type { SdrStation } from '@/types/SdrStation';
import styles from './SdrInfoPanel.module.css';

// Tipos e interfaces

/**
 * Propiedades del componente SdrInfoPanel.
 */
interface SdrInfoPanelProps {
  /** 
   * La estación que se encuentra en línea de vista directa actualmente.
   * Si es null, indica que la ISS no es visible desde ninguna estación. 
   */
  station: SdrStation | null;
  /**
   * La frecuencia de radio procesada y ajustada por el efecto Doppler actual, como un string formatado.
   */
  frequency: string;
}

// Componente principal

/**
 * SdrInfoPanel: Panel de telemetría e información lateral.
 * Muestra los detalles de la estación en contacto y la frecuencia Doppler de recepción en vivo.
 * Provee la funcionalidad de copiar dicha frecuencia al portapapeles.
 */
const SdrInfoPanel = ({ station, frequency }: SdrInfoPanelProps) => {
  // Estados
  const [copied, setCopied] = useState(false);

  // Funciones auxiliares / Event Handlers

  /**
   * Maneja el evento de click para copiar la frecuencia actual de la ISS al portapapeles del sistema
   * y muestra temporalmente un ícono de éxito.
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(frequency);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  /**
   * Maneja el click en el logo de la estación SDR para abrir un portal a dicha terminal.
   */
  const handleOpenStationLink = () => {
    if (station && station.url) {
      window.open(station.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Render

  if (!station) {
    return (
      <div className={styles.panelContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.section}>
            <div className={styles.iconWrapper}>
              <FiRadio />
            </div>

            <div className={styles.infoContent}>
              <span className={styles.label}>Estación</span>
              <span className={styles.value}>
                Ninguna estación en rango
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panelContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.section}>
          <div
            className={styles.iconWrapper}
            onClick={handleOpenStationLink}
            title="Abrir enlace de la estación SDR"
          >
            <FiRadio />
          </div>

          <div className={styles.infoContent}>
            <span className={styles.label}>Estación</span>

            <span className={styles.value}>
              {station.city}, {station.country}
            </span>

            <span className={styles.subValue}>{station.utc}</span>
          </div>
        </div>

        <div className={styles.frequencySection}>
          <div className={styles.infoContent}>
            <span className={styles.label}>Frecuencia</span>

            <div className={styles.frequencyDisplay}>
              <span className={styles.frequencyValue}>{frequency}</span>

              <button
                onClick={handleCopy}
                className={`${styles.copyButton} ${copied ? styles.copied : ''
                  }`}
                title="Copiar frecuencia"
                aria-label="Copiar frecuencia"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.frequencySection}>
          <div className={styles.infoContent}>
            <span className={styles.label}>Distancia Espacial Total</span>
            <div className={styles.frequencyDisplay}>
              <span className={styles.frequencyValue}>{station.distanceFromIss?.toFixed(2) || '0.00'} km</span>
            </div>
          </div>
        </div>

        <div className={styles.frequencySection}>
          <div className={styles.infoContent}>
            <span className={styles.label}>Elevación Topocéntrica</span>
            <div className={styles.frequencyDisplay}>
              <span className={styles.frequencyValue}>{station.elevation?.toFixed(2) || '0.00'}°</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SdrInfoPanel;