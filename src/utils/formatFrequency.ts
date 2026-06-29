// Imports
import type { SdrStation } from '@/types/SdrStation';
import type { IssPosition } from '@/utils/calculateISSPosition';

// Constantes físicas del mundo real
const C_KM_S = 299792.458; // Velocidad de la luz en el vacío (km/s)
const EARTH_RADIUS_KM = 6371; // Radio medio volumétrico de la Tierra (km)

// Funciones auxiliares de cálculo geométrico y espacial

/**
 * Convierte coordenadas geodésicas estándar (latitud, longitud, altitud) a coordenadas
 * cartesianas tridimensionales ECEF (Earth-Centered, Earth-Fixed) usando un modelo de Tierra Esférica.
 * Esto es necesario para calcular distancias espaciales reales y elevaciones absolutas.
 */
export const toCartesian = (
  lat: number,
  lng: number,
  alt: number
): { x: number; y: number; z: number } => {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  const r = EARTH_RADIUS_KM + alt;

  return {
    x: r * Math.cos(latRad) * Math.cos(lngRad),
    y: r * Math.cos(latRad) * Math.sin(lngRad),
    z: r * Math.sin(latRad),
  };
};

/**
 * Calcula la distancia euclidiana en el espacio 3D (slant range) entre dos puntos ECEF.
 * Usada para determinar el desplazamiento absoluto que genera el efecto Doppler.
 */
export const distance3D = (
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number }
): number => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Calcula el ángulo topocéntrico de elevación de la ISS (en grados) respecto a una estación terrestre
 * que observa hacia el cielo.
 * 
 * Matemáticamente:
 * 1. Calcula el vector espacial directo desde la estación (suelo) a la ISS (órbita).
 * 2. Calcula el vector normal de la estación (que apunta al cenit local).
 * 3. Utiliza el producto escalar de ambos vectores sobre el plano local para obtener el ángulo visual.
 */
export const getElevation = (
  stationLat: number,
  stationLng: number,
  stationAlt: number,
  issLat: number,
  issLng: number,
  issAlt: number
): number => {
  const station3D = toCartesian(stationLat, stationLng, stationAlt);
  const iss3D = toCartesian(issLat, issLng, issAlt);

  // Vector de línea de visión: estación -> ISS
  const rx = iss3D.x - station3D.x;
  const ry = iss3D.y - station3D.y;
  const rz = iss3D.z - station3D.z;

  const slantRange = Math.sqrt(rx * rx + ry * ry + rz * rz);
  if (slantRange === 0) return 90; // Excepción: La ISS está idénticamente en la estación

  const stationNorm = Math.sqrt(
    station3D.x * station3D.x +
    station3D.y * station3D.y +
    station3D.z * station3D.z
  );
  if (stationNorm === 0) return -90;

  // Vector unitario que apunta al Cenit en la posición de la estación
  const nx = station3D.x / stationNorm;
  const ny = station3D.y / stationNorm;
  const nz = station3D.z / stationNorm;

  // Producto escalar
  const dotProduct = rx * nx + ry * ny + rz * nz;
  const sinElevation = dotProduct / slantRange;

  const clampedSin = Math.max(-1, Math.min(1, sinElevation));
  const elevationRad = Math.asin(clampedSin);

  return (elevationRad * 180) / Math.PI; // a grados
};

/**
 * Retorna un booleano indicando si la estación tiene LOS (Line Of Sight).
 * Un objeto en órbita tiene Línea de Visión si está situado geométricamente por encima del horizonte topográfico (>0°).
 */
export const hasLOS = (elevationDeg: number): boolean => {
  return elevationDeg > 0;
};

// Funciones principales del negocio

/**
 * Simulación y Cálculo del Efecto Doppler de Radio Frecuencia.
 * 
 * Las altas velocidades orbitales comprimen o expanden las ondas electromagnéticas
 * percibidas por el receptor debido a que la fuente emisora (la ISS) se desplaza rápidamente
 * acercándose o alejándose por el espacio.
 * 
 * Se calcula midiendo la diferencia en la distancia 3D real entre el marco de tiempo anterior y el actual.
 */
export const getStationFrequency = (
  currentIss: IssPosition,
  prevIss: IssPosition,
  deltaTimeSeconds: number,
  baseFreqMHz: number,
  station: IssPosition
): string => {
  if (deltaTimeSeconds <= 0) {
    return `${baseFreqMHz.toFixed(5)}`;
  }

  const station3D = toCartesian(station.lat, station.lng, station.alt);
  const current3D = toCartesian(currentIss.lat, currentIss.lng, currentIss.alt);
  const prev3D = toCartesian(prevIss.lat, prevIss.lng, prevIss.alt);

  const currentDistance = distance3D(station3D, current3D);
  const prevDistance = distance3D(station3D, prev3D);

  // Derivada de la distancia = Velocidad Radial (Acercamiento < 0, Alejamiento > 0)
  const radialVelocityKmS = (currentDistance - prevDistance) / deltaTimeSeconds;

  // Fórmula de desplazamiento Doppler para frecuencias electromagnéticas no relativistas.
  const shiftedFreq = baseFreqMHz * (1 - radialVelocityKmS / C_KM_S);

  return `${shiftedFreq.toFixed(5)}`;
};

/**
 * Escáner de Visibilidad: Itera por todo el catálogo de Estaciones Terrenas y determina
 * la mejor opción de enlace seleccionando aquella que tiene mayor ángulo de elevación
 * (que estadísticamente sufre menos ruido atmosférico o bloqueo topográfico).
 * 
 * Modifica directamente las propiedades temporales 'distanceFromIss' y 'elevation' en los objetos 
 * para ser reutilizadas posteriormente en la UI sin recalcular.
 */
export const getBestStation = (
  issPosition: IssPosition,
  stations: SdrStation[]
): SdrStation | null => {
  if (!stations.length) return null;

  let best: SdrStation | null = null;
  let maxElevation = -Infinity;

  for (const station of stations) {
    const station3D = toCartesian(station.lat, station.lng, 0);
    const iss3D = toCartesian(issPosition.lat, issPosition.lng, issPosition.alt);

    const slantRange = distance3D(station3D, iss3D);
    station.distanceFromIss = slantRange;

    const elevation = getElevation(
      station.lat,
      station.lng,
      0,
      issPosition.lat,
      issPosition.lng,
      issPosition.alt
    );

    // Si está por sobre el horizonte y es mayor al máximo encontrado, la marcamos como mejor.
    if (hasLOS(elevation)) {
      if (elevation > maxElevation) {
        maxElevation = elevation;
        best = station;
        station.elevation = maxElevation;
      }
    }
  }

  if (!best) {
    console.log(
      '🛰️ ISS fuera de rango. Ninguna estación terrestre SDR tiene línea de vista directa (LOS).'
    );
    return null;
  }

  console.log(
    `✅ Mejor estación: ${best.city}, ${best.country} (Distancia real: ${best.distanceFromIss.toFixed(2)} km, Elevación: ${maxElevation.toFixed(2)}°)`
  );

  return best;
};