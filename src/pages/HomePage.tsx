import { Link } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';

const HomePage = () => {
  const { badges, xp, completedWeeks } = useProgressStore();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Cálculo Multivariante - Página de Inicio</h1>
<div className="mb-8 flex flex-col items-center">
  <span className="text-base text-gray-700 mb-2">¿Ya tienes una cuenta?</span>
  <a href="/login" className="inline-block px-4 py-2 bg-blue-600 text-black font-semibold rounded hover:bg-blue-700">Inicia sesión aquí</a>
</div>
      
      {/* Logros del estudiante */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Logros del Estudiante</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Experiencia: solo si xp > 0 */}
          {xp > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 flex items-center justify-between shadow-md">
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Experiencia</h3>
                <p className="text-3xl font-bold text-indigo-600">{xp} XP</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 text-2xl">
                ⭐
              </div>
            </div>
          )}
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
          {/* Medallas: solo si el usuario tiene alguna medalla de plata/oro */}
          {badges && badges.filter(b => b.includes('plata') || b.includes('oro')).length > 0 &&
            badges.filter(b => b.includes('plata') || b.includes('oro')).map((badge, idx) => (
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
          {/* Copas: solo si el usuario tiene alguna copa */}
          {badges && badges.filter(b => b.includes('copa')).length > 0 &&
            badges.filter(b => b.includes('copa')).map((badge, idx) => (
              <div key={badge+idx} className={`rounded-lg p-4 flex flex-col items-center justify-between shadow-md ${badge.includes('plata') ? 'bg-gradient-to-r from-slate-100 to-blue-200' : 'bg-gradient-to-r from-yellow-200 to-yellow-400'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏆</span>
                  <h3 className="text-lg font-semibold">
                    {badge.includes('plata') ? 'Copa de Plata' : 'Copa de Oro'}
                  </h3>
                </div>
                <span className="text-xs text-gray-500">{badge.replace(/_/g, ' ')}</span>
              </div>
            ))}
        </div>
        
        {/* Medallas del estudiante */}
        {badges && badges.filter(b => !b.includes('plata') && !b.includes('oro') && !b.includes('copa')).length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Tus medallas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.filter(b => !b.includes('plata') && !b.includes('oro') && !b.includes('copa')).map((badge, idx) => (
                <div
                  key={badge + idx}
                  className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center border"
                >
                  <span className="text-3xl mb-2">
                    {badge.includes('week') ? '🏆' : badge === 'minimalista' ? '⭐' : badge === 'wizard' ? '🧙‍♂️' : '🎖️'}
                  </span>
                  <p className="text-sm font-medium text-gray-700">
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