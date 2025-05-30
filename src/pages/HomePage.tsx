import { Link } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';

const HomePage = () => {
  const { badges, xp } = useProgressStore();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Cálculo Multivariante - Página de Inicio</h1>
      
      {/* Logros del estudiante */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Logros del Estudiante</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">Experiencia</h3>
              <p className="text-3xl font-bold text-indigo-600">{xp} XP</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 text-2xl">
              ⭐
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-emerald-700">Medallas</h3>
              <p className="text-3xl font-bold text-emerald-600">{badges.length}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 text-2xl">
              🏆
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-700">Nivel</h3>
              <p className="text-3xl font-bold text-orange-600">{Math.floor(xp / 100) + 1}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full text-orange-600 text-2xl">
              🔥
            </div>
          </div>
        </div>
        
        {/* Medallas del estudiante */}
        {badges.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Tus medallas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {badges.map((badge) => (
                <div key={badge} className="bg-gray-50 border rounded-lg p-3 flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-2 text-xl">
                    {badge.includes('week') ? '🏆' : '⭐'}
                  </div>
                  <p className="font-medium text-center text-sm">
                    {badge.includes('week')
                      ? `Semana ${badge.split('-')[1]}`
                      : badge === 'minimalista'
                      ? 'Minimalista'
                      : badge === 'wizard'
                      ? 'Data Wizard'
                      : badge}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Navegación Directa</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/login" className="bg-blue-500 text-white p-4 rounded-md text-center hover:bg-blue-600">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="bg-green-500 text-white p-4 rounded-md text-center hover:bg-green-600">
            Registrarse
          </Link>
          <Link to="/dashboard" className="bg-purple-500 text-white p-4 rounded-md text-center hover:bg-purple-600">
            Dashboard (saltar autenticación)
          </Link>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Acceso Directo a Semanas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(weekId => (
            <Link 
              key={weekId}
              to={`/semana/${weekId}`} 
              className="bg-indigo-500 text-white p-4 rounded-md text-center hover:bg-indigo-600"
            >
              Semana {weekId}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 