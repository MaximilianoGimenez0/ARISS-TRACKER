// Imports
import styles from './InfoPage.module.css';
import { LuBinary, LuActivity, LuGlobe, LuEye, LuRadioReceiver } from 'react-icons/lu';

// Componente principal

/**
 * InfoPage: Vista estática informativa de la aplicación.
 * Desglosa y explica paso por paso la teoría, el modelo matemático y los cálculos orbitales 
 * subyacentes que permiten a la aplicación predecir y rastrear la ISS en tiempo real, 
 * junto al cálculo del efecto Doppler.
 */
const InfoPage = () => {

    // Render
    return (
        <div className={styles.container}>
            <div className={styles.content}>

                {/* 1. Sección Hero (Encabezado principal) */}
                <header className={styles.hero}>
                    <h1 className={styles.title}>
                        Ingeniería detrás del <span className={styles.accentOrange}>Rastreo</span>
                    </h1>
                </header>

                {/* 2. Sección de Datos TLE (Explicación del origen de la información) */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.iconWrapper}><LuBinary size={28} /></div>
                        <h2 className={styles.cardTitle}>1. Conjunto de Elementos de Dos Líneas (TLE)</h2>
                    </div>

                    <p className={styles.cardText}>
                        El rastreo comienza con un TLE (Two-Line Element), un formato de datos estándar codificado
                        que describe las variables orbitales (elementos keplerianos) de un satélite en un momento
                        específico (época). A partir de estos parámetros, podemos extrapolar su posición futura.
                    </p>

                    <div className={styles.tleTerminal}>
                        <span className={styles.tleLine}>ISS (ZARYA)</span>
                        <span className={styles.tleLine}>
                            1 <span className={styles.tleHighlightOrange}>25544</span>U 98067A   23282.52981545  .00018177  00000-0  32997-3 0  9997
                        </span>
                        <span className={styles.tleLine}>
                            2 <span className={styles.tleHighlightOrange}>25544</span> <span className={styles.tleHighlightBlue}> 51.6418</span>  94.1378 0003551  53.2847 306.9042 15.50027725419358
                        </span>
                    </div>

                    <div className={styles.tagContainer}>
                        <span className={styles.tag}>NORAD ID (25544)</span>
                        <span className={`${styles.tag} ${styles.tagBlue}`}>Inclinación (51.6418°)</span>
                    </div>
                </section>

                <div className={styles.grid}>
                    {/* 3. Sección de Propagación SGP4 (Cálculo del movimiento) */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><LuActivity size={28} /></div>
                            <h2 className={styles.cardTitle}>2. Propagación Orbital</h2>
                        </div>

                        <p className={styles.cardText}>
                            Los satélites en Órbita Terrestre Baja (LEO) sufren perturbaciones debido a la gravedad
                            de la Luna, el Sol y el achatamiento de la Tierra, además del arrastre atmosférico.
                        </p>
                        <p className={styles.cardText}>
                            El modelo <span className={styles.accentOrange}>SGP4 (Simplified General Perturbations-4)</span> toma
                            el TLE y resuelve las ecuaciones de movimiento para predecir los vectores de estado (posición y velocidad)
                            exactos del satélite en el espacio en cualquier instante de tiempo.
                        </p>
                    </section>

                    {/* 4. Sección de Transformación Espacial ECEF */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><LuGlobe size={28} /></div>
                            <h2 className={styles.cardTitle}>3. Geodésicas a ECEF</h2>
                        </div>

                        <p className={styles.cardText}>
                            Para calcular hacia dónde mirar, convertimos las coordenadas de nuestra estación terrena
                            (Latitud, Longitud, Altitud) a un sistema cartesiano 3D llamado <span className={styles.strong}>ECEF</span> (Earth-Centered, Earth-Fixed).
                        </p>
                        <p className={styles.cardText}>
                            Al tener tanto el satélite como al observador en coordenadas (X, Y, Z), calculamos el <span className={styles.strong}>Vector Relativo</span> (distancia y dirección en el espacio).
                        </p>

                        <div className={styles.mathBlock}>
                            <div className={styles.formula}>
                                Vector Relativo = Posición Satélite − Posición Observador
                            </div>
                        </div>
                    </section>
                </div>

                <div className={styles.grid}>
                    {/* 5. Sección de Línea de Vista (LOS) y Trigonometría */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><LuEye size={28} /></div>
                            <h2 className={styles.cardTitle}>4. Línea de Vista (LOS)</h2>
                        </div>

                        <p className={styles.cardText}>
                            Mediante trigonometría esférica y el producto escalar entre el vector del observador y
                            el vector relativo, obtenemos los ángulos de apuntamiento: <span className={styles.strong}>Azimut</span> (rumbo) y <span className={styles.strong}>Elevación</span>.
                        </p>

                        <div className={styles.mathBlock}>
                            <div className={styles.formula}>
                                Elevación &gt; 0° ⟹ LOS (Visible)
                            </div>
                        </div>

                        <p className={styles.cardText}>
                            Si la elevación es mayor a cero, significa que el satélite ha superado el horizonte
                            topográfico y tenemos contacto visual o de radio directo (Line of Sight).
                        </p>
                    </section>

                    {/* 6. Sección de Efecto Doppler y Modulación */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><LuRadioReceiver size={28} /></div>
                            <h2 className={styles.cardTitle}>5. Corrección Doppler</h2>
                        </div>

                        <p className={styles.cardText}>
                            La ISS se mueve a ~28,000 km/h. Debido a esta enorme velocidad radial relativa,
                            las frecuencias de radio se comprimen al acercarse (<span className={styles.accentBlue}>Blue Shift</span>) y se expanden al alejarse (<span className={styles.accentOrange}>Red Shift</span>).
                        </p>
                        <p className={styles.cardText}>
                            Para recibir la telemetría (ej. en 145.800 MHz VHF), el sistema debe compensar
                            constantemente esta desviación para mantener la sintonía en el receptor SDR en tiempo real.
                        </p>

                        <div className={styles.mathBlock}>
                            <div className={styles.formula}>
                                Δf = f₀ × (v / c)
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
