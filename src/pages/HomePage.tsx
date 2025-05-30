import { Link } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';

const HomePage = () => {
  const { badges, xp, completedWeeks } = useProgressStore();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Cálculo Multivariante - Página de Inicio</h1>
      
      {/* Logros del estudiante */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Logros del Estudiante</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Experiencia: siempre visible */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 flex items-center justify-between shadow-md">
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">Experiencia</h3>
              <p className="text-3xl font-bold text-indigo-600">{xp} XP</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 text-2xl">
              ⭐
            </div>
          </div>
          {/* Nivel: solo si el usuario aprobó alguna semana */}
          {completedWeeks && completedWeeks.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 flex items-center justify-between shadow-md">
              <div>
                <h3 className="text-lg font-semibold text-orange-700">Nivel</h3>
                <p className="text-3xl font-bold text-orange-600">{completedWeeks.length}</p>
                <span className="text-xs text-orange-500">Semanas aprobadas</span>
              </div>
              <div className="bg-orange-100 p-3 rounded-full text-orange-600 text-2xl">
                🔥
              </div>
            </div>
          )}
          {/* Medallas: solo si el usuario tiene alguna */}
          {badges && badges.filter(b => b.includes('plata') || b.includes('oro')).length > 0 && badges.filter(b => b.includes('plata') || b.includes('oro')).map((badge, idx) => (
            <div key={badge+idx} className={`rounded-lg p-4 flex flex-col items-center justify-between shadow-md ${badge.includes('plata') ? 'bg-gradient-to-r from-gray-100 to-blue-100' : 'bg-gradient-to-r from-yellow-100 to-yellow-300'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {badge.includes('plata') ? '🥈' : '🥇'}
                </span>
                <h3 className="text-lg font-semibold">
                  {badge.includes('plata') ? 'Medalla de Plata' : 'Medalla de Oro'}
                </h3>
              </div>
              <span className="text-xs text-gray-500">{badge.replace(/_/g, ' ')}</span>
            </div>
          ))}
          {/* Copas: solo si el usuario tiene alguna */}
          {badges && badges.filter(b => b.includes('copa')).length > 0 && badges.filter(b => b.includes('copa')).map((badge, idx) => (
            <div key={badge+idx} className={`rounded-lg p-4 flex flex-col items-center justify-between shadow-md ${badge.includes('plata') ? 'bg-gradient-to-r from-slate-100 to-blue-200' : 'bg-gradient-to-r from-yellow-200 to-yellow-400'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {badge.includes('plata') ? '🏆' : '🏆'}
                </span>
                <h3 className="text-lg font-semibold">
                  {badge.includes('plata') ? 'Copa de Plata' : 'Copa de Oro'}
                </h3>
              </div>
              <span className="text-xs text-gray-500">{badge.replace(/_/g, ' ')}</span>
            </div>
          ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/login" className="bg-blue-500 text-white p-4 rounded-md text-center hover:bg-blue-600">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="bg-green-500 text-white p-4 rounded-md text-center hover:bg-green-600">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;