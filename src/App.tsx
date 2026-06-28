// Imports
import AppRouter from '@/routes/AppRouter';

// Componente principal

/**
 * App: Componente raíz de React.
 * Su única responsabilidad en esta arquitectura es instanciar el Router principal.
 * Cualquier proveedor global de estado (Context, Redux, etc.) debería envolver a este componente.
 */
const App = () => {
  // Render
  return <AppRouter />;
};

export default App;
