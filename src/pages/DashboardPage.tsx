
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
const DashboardPage = () => {

  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

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

    </div>
  );
};

export default DashboardPage; 