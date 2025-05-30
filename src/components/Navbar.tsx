import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const location = useLocation();
  const params = useParams();
  
  // Verificar si estamos en una página de semana 1
  const isInWeek1 = location.pathname.startsWith('/semana/1');
  
  // Determinar qué sección de la semana 1 está activa
  const getActivePath = () => {
    if (location.pathname.includes('/leccion/')) return 'leccion';
    if (location.pathname.includes('/ejercicio-analitico/')) return 'ejercicio-analitico';
    if (location.pathname.includes('/ejercicio-codigo/')) return 'ejercicio-codigo';
    if (location.pathname.includes('/reto/')) return 'reto';
    return '';
  };
  
  // Obtener el título basado en la ruta actual
  const getCurrentTitle = () => {
    const activePath = getActivePath();
    const pathMap = {
      'leccion': 'Introducción al Cálculo Multivariante',
      'ejercicio-analitico': 'Ejercicios Analíticos',
      'ejercicio-codigo': 'Ejercicios de Código',
      'reto': 'Reto Semanal'
    };
    
    return pathMap[activePath] || 'Semana 1';
  };
  
  // Si estamos en la semana 1, mostrar navegación contextual
  if (isInWeek1) {
    const activePath = getActivePath();
    
    return (
      <header className="bg-primary-600 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <Link to="/" className="text-xl font-bold">
              Semana 1
            </Link>
            {activePath && (
              <span className="text-white/80 ml-2 text-lg">
                &rsaquo; {getCurrentTitle()}
              </span>
            )}
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link 
              to="/semana/1/leccion/1" 
              className={`px-3 py-1 rounded-md ${
                activePath === 'leccion' 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'hover:bg-white/10'
              }`}
            >
              Lección 1.1
            </Link>
            <Link 
              to="/semana/1/ejercicio-analitico/1" 
              className={`px-3 py-1 rounded-md ${
                activePath === 'ejercicio-analitico' 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'hover:bg-white/10'
              }`}
            >
              Ejercicio A 1.1
            </Link>
            <Link 
              to="/semana/1/ejercicio-codigo/1" 
              className={`px-3 py-1 rounded-md ${
                activePath === 'ejercicio-codigo' 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'hover:bg-white/10'
              }`}
            >
              Ejercicio C 1.1
            </Link>
            <Link 
              to="/semana/1/reto/1" 
              className={`px-3 py-1 rounded-md ${
                activePath === 'reto' 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'hover:bg-white/10'
              }`}
            >
              Reto 1.1
            </Link>
            <Link to="/" className="text-sm hover:text-white/80 ml-4">
              <span className="text-white/70">↩</span> Volver
            </Link>
          </nav>
        </div>
      </header>
    );
  }
  
  // Si no estamos en la semana 1, mostrar la navegación normal
  return (
    <header className="bg-primary-600 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Cálculo Multivariante
        </Link>
        
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/" className="hover:text-white/80">
                Dashboard
              </Link>
              <button 
                onClick={logout}
                className="hover:text-white/80"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white/80">
                Iniciar sesión
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-primary-600 px-4 py-2 rounded-md font-medium hover:bg-white/90"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 