
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';


import { useNavigate } from 'react-router-dom';
const DashboardPage = () => {

  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const { completedWeeks, badges } = useProgressStore();
  
  // Datos simulados de semanas (en una app real vendrían de una API/store)
  const weeks = [
    { id: 1, title: 'Introducción al Cálculo Multivariante' },
    { id: 2, title: 'Vectores y Espacio Vectorial' },
    { id: 3, title: 'Derivadas Parciales' },
    { id: 4, title: 'Gradientes y Direccionales' },
    { id: 5, title: 'Optimización' },
    { id: 6, title: 'Integrales Múltiples' },
    { id: 7, title: 'Teorema de Green y Stokes' },
    { id: 8, title: 'Aplicaciones en Ciencia de Datos' },
  ];
  

  // Calcular progreso global

  
  return (
    <div className="p-8">
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-black font-semibold rounded hover:bg-blue-700"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Cerrar sesión
        </button>
      </div>
      
      {/* Selección de semana, no mostrar actividades directamente */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Acceso a Semanas</h2>
        <div className="w-full max-w-md flex flex-col gap-4">
          {/* Semana 1 siempre disponible */}
          <button
            className="block w-full p-6 text-center rounded-lg bg-blue-600 text-white text-xl font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => navigate('/semana/1')}
          >
            Semana 1: Introducción al Cálculo Multivariante
          </button>
          {/* Semana 2 bloqueada visualmente */}
          <button
            className="block w-full p-6 text-center rounded-lg bg-gray-300 text-gray-500 text-xl font-semibold cursor-not-allowed"
            disabled
          >
            Semana 2: Optimización (Completa Semana 1 para desbloquear)
          </button>
        </div>
      </div>
      {/* Sección de badges */}
      {badges.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tus medallas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <div key={badge} className="bg-gray-50 border rounded-lg p-4 flex flex-col items-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3 text-2xl">
                  {badge.includes('week') ? '🏆' : '⭐'}
                </div>
                <p className="font-medium text-center">
                  {badge.includes('week')
                    ? `Semana ${badge.split('-')[1]} completada`
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
  );
};

export default DashboardPage; 