// Funciones principales

/**
 * getTLE: Realiza una solicitud HTTP a la API pública de ARISS (Amateur Radio on the ISS)
 * para obtener el conjunto de elementos orbitales (TLE) más reciente en formato de texto puro.
 * 
 * Este TLE es la "semilla" matemática obligatoria que necesita el propagador SGP4
 * para calcular la órbita presente y futura.
 * 
 * @returns {Promise<string>} Una promesa que se resuelve con el contenido bruto (raw text) del TLE.
 * @throws Lanzará un error si la solicitud de red falla o el servidor de ARISS está caído.
 */
export const getTLE = async (): Promise<string> => {
  try {
    const response = await fetch('https://live.ariss.org/iss.txt');
    if (!response.ok) {
      throw new Error(`Failed to fetch TLE: ${response.status} ${response.statusText}`);
    }
    const data = await response.text();
    return data.trim();
  } catch (error) {
    console.error('Error fetching ISS TLE (Red/API fallback):', error);
    throw error;
  }
};
