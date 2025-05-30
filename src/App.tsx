import { Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import WeekPage from './pages/WeekPage'
import LessonPage from './pages/LessonPage'
import AnalyticalExercisePage from './pages/AnalyticalExercisePage'
import CodeExercisePage from './pages/CodeExercisePage'
import ChallengeExercisePage from './pages/ChallengeExercisePage'
import ModulePage from './pages/ModulePage'
import Layout from './components/Layout'

function NavigationBar() {
  const location = useLocation();
  const isInWeek1 = location.pathname.startsWith('/semana/1');
  
  if (isInWeek1) {
    return (
      <div className="bg-gray-800 text-white p-4 mb-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold mb-2">Semana 1</h1>
          </div>
          <Link 
            to="/" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 text-white p-4 mb-4">
      <div className="container mx-auto">
        <h1 className="text-xl font-bold mb-2">Navegación para Pruebas</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Inicio</Link>
          <Link to="/login" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Login</Link>
          <Link to="/register" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Registro</Link>
          <Link to="/dashboard" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Dashboard</Link>
          <Link to="/semana/1" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Semana 1</Link>
          <Link to="/semana/2" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Semana 2</Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      {/* Barra de navegación de prueba para debugging */}
      <NavigationBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage isRegister={true} />} />
        
        {/* Rutas protegidas dentro del Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/semana/:weekId" element={<WeekPage />} />
          <Route path="/semana/:weekId/leccion/:lessonId" element={<LessonPage />} />
          <Route path="/semana/:weekId/ejercicio-analitico/:exerciseId" element={<AnalyticalExercisePage />} />
          <Route path="/semana/:weekId/ejercicio-codigo/:exerciseId" element={<CodeExercisePage />} />
          <Route path="/semana/:weekId/reto/:challengeId" element={<ChallengeExercisePage />} />
          <Route path="/semana/:weekId/modulo/:moduleId" element={<ModulePage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App 