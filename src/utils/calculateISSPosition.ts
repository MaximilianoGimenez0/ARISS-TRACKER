// Imports
import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
  degreesLong,
  degreesLat,
} from 'satellite.js';

// Tipos e interfaces

/**
 * Representa la posición geodésica espacial de la Estación Espacial Internacional (ISS).
 */
export interface IssPosition {
  /** Latitud terrestre en grados */
  lat: number;
  /** Longitud terrestre en grados */
  lng: number;
  /** Altitud sobre el nivel del mar en kilómetros */
  alt: number;
}

// Funciones principales

/**
 * Propagador Orbital: Calcula la posición geodésica exacta (Latitud, Longitud, Altitud)
 * desde un conjunto de datos TLE usando el modelo matemático SGP4.
 * 
 * Este proceso consta de:
 * 1. Procesamiento de las 2 líneas TLE (Two-Line Elements).
 * 2. Generación del Satrec (Satellite Record) que representa la órbita.
 * 3. Propagación para obtener el vector de posición ECI (Earth-Centered Inertial) para el instante de tiempo actual.
 * 4. Conversión de las coordenadas inerciales ECI al marco rotatorio de la Tierra (Geodésicas ECEF).
 *
 * @param tleStr Cadena de texto que contiene el TLE de la ISS (3 líneas, donde la primera suele ser el nombre).
 * @returns La posición geodésica calculada (IssPosition), o null si los datos son inválidos o falló la propagación.
 */
export const calculateISSPosition = (tleStr: string): IssPosition | null => {
  try {
    // Limpieza y validación de las líneas del TLE
    const lines = tleStr
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      console.warn('TLE inválido: menos de 2 líneas');
      return null;
    }

    // Tomamos siempre las últimas dos líneas por si la primera contiene solo el nombre del satélite
    const [tleLine1, tleLine2] = lines.length === 2 ? lines : lines.slice(-2);

    // 1. Inicialización del modelo SGP4 (Satellite Record)
    const satrec = twoline2satrec(tleLine1, tleLine2);

    // Instante de evaluación temporal actual
    const now = new Date();

    // 2. Propagación para obtener posición y velocidad en coordenadas ECI (Inerciales)
    const pv = propagate(satrec, now);

    if (!pv?.position || typeof pv.position === 'boolean') {
      console.warn('Propagation falló (posición inercial ECI inválida)');
      return null;
    }

    // 3. Tiempo Sidéreo Medio de Greenwich para convertir entre ECI (inercial) y ECEF (rotatorio fijo)
    const gmst = gstime(now);

    // 4. Conversión a coordenadas geodésicas (Latitud, Longitud, Altitud)
    const gd = eciToGeodetic(pv.position, gmst);

    // Extracción y conversión a unidades comprensibles (grados y kilómetros)
    const lat = degreesLat(gd.latitude);
    const lng = degreesLong(gd.longitude);
    const alt = gd.height;

    // Validación final para prevenir valores corruptos (NaN / Infinity)
    if (![lat, lng, alt].every(Number.isFinite)) {
      return null;
    }

    return { lat, lng, alt };
  } catch (err) {
    console.error('Error calculando posición de la ISS (SGP4 Model Error):', err);
    return null;
  }
};