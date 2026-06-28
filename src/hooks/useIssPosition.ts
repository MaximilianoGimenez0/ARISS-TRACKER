// Imports
import { useEffect, useRef } from 'react';
import { getTLE } from '@/services/getTLE';
import { calculateISSPosition } from '@/utils/calculateISSPosition';

// Tipos e interfaces

/**
 * Representa un punto de rastreo histórico o suavizado de la ISS.
 */
interface IssTrackPoint {
  lat: number;
  lng: number;
  alt: number;
  timestamp: number;
}

// Constantes
const UPDATE_INTERVAL_MS = 150;
const TLE_FETCH_INTERVAL_MS = 60000;
const MAX_PATH_POINTS = 2000;
const LERP_FACTOR = 0.08;

// Hook personalizado

/**
 * Hook para propagar la posición orbital de la ISS y animarla suavemente en un globo 3D.
 * 
 * Se encarga de:
 * 1. Obtener y actualizar el TLE de la ISS periódicamente.
 * 2. Calcular la posición real usando SGP4.
 * 3. Interpolar (suavizar) el movimiento entre fotogramas para animaciones 60fps.
 * 4. Actualizar las capas del objeto Globe (html, paths, rings) de manera optimizada directamente en el DOM/WebGL.
 *
 * @param globeRef Referencia al objeto Globe instanciado.
 * @param issPositionRef Referencia mutable expuesta para que otros componentes lean la posición actual sin re-renderizar.
 * @param onAvailable Callback que se ejecuta por primera vez cuando se tiene una posición válida de la ISS.
 */
const useIssPosition = (
  globeRef: React.MutableRefObject<any>,
  issPositionRef?: React.MutableRefObject<{ lat: number; lng: number; alt: number } | null>,
  onAvailable?: () => void
) => {
  // Refs para temporizadores y control de ejecución
  const tleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const propagateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasNotifiedRef = useRef(false);
  const onAvailableRef = useRef(onAvailable);

  // Refs de estado para el TLE y el suavizado del movimiento
  const tleRef = useRef<string>('');
  const bufferRef = useRef<IssTrackPoint[]>([]);
  const lastRenderedRef = useRef<{ lat: number; lng: number; alt: number } | null>(null);

  // Objeto estable para evitar recreación de elementos DOM del marcador de la ISS
  const issPointRef = useRef({
    lat: 0,
    lng: 0,
    alt: 0,
    isISS: true,
    city: 'ISS',
    country: 'Orbit',
    element: null as HTMLDivElement | null,
  });

  // Effects

  /**
   * Effect: Actualiza la referencia del callback para que apunte siempre a la última función onAvailable proporcionada,
   * evitando recrear el intervalo principal de propagación si el componente padre se re-renderiza.
   */
  useEffect(() => {
    onAvailableRef.current = onAvailable;
  }, [onAvailable]);

  /**
   * Effect: Obtiene el TLE actual al montarse y luego periódicamente.
   * El TLE contiene la "semilla" para calcular la órbita en cualquier instante de tiempo.
   */
  useEffect(() => {
    const fetchTle = async () => {
      try {
        tleRef.current = await getTLE();
      } catch (e) {
        console.error('Error fetching TLE in hook:', e);
      }
    };

    fetchTle();
    tleIntervalRef.current = setInterval(fetchTle, TLE_FETCH_INTERVAL_MS);

    return () => {
      if (tleIntervalRef.current) clearInterval(tleIntervalRef.current);
    };
  }, []);

  /**
   * Effect: Bucle principal de propagación y animación.
   * Se ejecuta a alta frecuencia (150ms) para calcular la nueva posición real y
   * mover la ISS suavemente usando interpolación lineal (LERP).
   */
  useEffect(() => {
    const tick = () => {
      const globe = globeRef.current;
      if (!globe || !tleRef.current) return;

      // 1. Calculamos la posición teórica real basada en el modelo SGP4
      const real = calculateISSPosition(tleRef.current);
      if (!real) return;

      const target = {
        lat: real.lat,
        lng: real.lng,
        alt: real.alt || 420,
      };

      if (!lastRenderedRef.current) {
        lastRenderedRef.current = target;
      }

      const prev = lastRenderedRef.current;
      const t = LERP_FACTOR; // Factor de suavizado

      // 2. Interpolación Lineal (LERP) para transiciones fluidas de latitud y altitud
      const lat = prev.lat + (target.lat - prev.lat) * t;
      const alt = prev.alt + (target.alt - prev.alt) * t;

      // 3. Manejo seguro del cruce del Antimeridiano (-180 / 180 longitud)
      let dLng = target.lng - prev.lng;
      if (dLng > 180) dLng -= 360;
      if (dLng < -180) dLng += 360;

      const lng = prev.lng + dLng * t;

      const smoothed = { lat, lng, alt };
      lastRenderedRef.current = smoothed;

      // 4. Agregar al historial para dibujar la órbita pasada (estela)
      bufferRef.current.push({
        ...smoothed,
        timestamp: Date.now(),
      });

      if (bufferRef.current.length > MAX_PATH_POINTS) {
        bufferRef.current.shift();
      }

      // 5. Actualizar propiedades del marcador estable (para el elemento HTML del DOM)
      const iss = issPointRef.current;
      iss.lat = smoothed.lat;
      iss.lng = smoothed.lng;
      iss.alt = smoothed.alt;

      // 6. Exponer la posición para que otros componentes (ej. para calcular efecto Doppler) la lean
      if (issPositionRef) {
        issPositionRef.current = { lat: smoothed.lat, lng: smoothed.lng, alt: smoothed.alt };
      }

      // Notificar disponibilidad de la primera posición válida
      if (onAvailableRef.current && !hasNotifiedRef.current) {
        hasNotifiedRef.current = true;
        onAvailableRef.current();
      }

      // 7. Renderizado directo al DOM para máxima performance sin pasar por el flujo reactivo
      if (iss.element) {
        const latEl = iss.element.querySelector('.iss-lat');
        const lngEl = iss.element.querySelector('.iss-lng');
        const altEl = iss.element.querySelector('.iss-alt');
        if (latEl) latEl.textContent = smoothed.lat.toFixed(4);
        if (lngEl) lngEl.textContent = smoothed.lng.toFixed(4);
        if (altEl) altEl.textContent = smoothed.alt.toFixed(1);
      }

      // 8. Actualizar las capas WebGL de la librería Globe.gl
      globe.htmlElementsData([iss]);

      if (bufferRef.current.length > 2) {
        globe.pathsData([
          bufferRef.current.map((p) => ({
            lat: p.lat,
            lng: p.lng,
            alt: 0.16,
          })),
        ]);
      }

      globe.ringsData([smoothed]);
    };

    // Lanzar el bucle de propagación
    propagateIntervalRef.current = setInterval(tick, UPDATE_INTERVAL_MS);

    return () => {
      if (propagateIntervalRef.current) {
        clearInterval(propagateIntervalRef.current);
      }
    };
  }, [globeRef, issPositionRef]);
};

export default useIssPosition;
