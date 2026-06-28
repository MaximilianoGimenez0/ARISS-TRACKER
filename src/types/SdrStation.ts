// Tipos e interfaces

/**
 * Representa una estación terrena SDR (Software Defined Radio)
 * capaz de interceptar las transmisiones VHF/UHF de la ISS.
 */
export type SdrStation = {
  /** Identificador único secuencial */
  id: number;
  /** País donde se encuentra físicamente la antena */
  country: string;
  /** Ciudad o región de la antena */
  city: string;
  /** Latitud geodésica */
  lat: number;
  /** Longitud geodésica */
  lng: number;
  /** Huso horario local como referencia */
  utc: string;
  /** URL del portal WebSDR / OpenWebRX para escuchar en vivo */
  url: string;
  
  /** 
   * Frecuencia corregida por el efecto Doppler actual (calculada en tiempo real).
   * Opcional porque se computa en el lado del cliente (frontend).
   */
  correctedFreq?: string | null;
  
  /** 
   * Distancia espacial absoluta 3D (Slant Range) en kilómetros hacia la ISS.
   * Opcional, se recalcula constantemente.
   */
  distanceFromIss?: number | null;
  
  /** 
   * Ángulo de elevación sobre el horizonte local. Si es > 0, hay línea de vista.
   * Opcional, se recalcula constantemente.
   */
  elevation?: number | null;
}
