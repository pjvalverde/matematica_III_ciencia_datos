
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 flex flex-col items-center w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acceso a Semanas</h2>
          <button
            className="block w-full p-6 text-center rounded-lg bg-blue-600 text-white text-xl font-semibold shadow hover:bg-blue-700 transition mb-4"
            onClick={() => navigate('/semana/1')}
          >
            Semana 1: Introducción al Cálculo Multivariante
          </button>
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