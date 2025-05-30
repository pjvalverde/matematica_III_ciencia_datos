import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

import DashboardPage from './pages/DashboardPage'
import WeekPage from './pages/WeekPage'
import LessonPage from './pages/LessonPage'
import AnalyticalExercisePage from './pages/AnalyticalExercisePage'
import CodeExercisePage from './pages/CodeExercisePage'
import ChallengeExercisePage from './pages/ChallengeExercisePage'
import ModulePage from './pages/ModulePage'
import Layout from './components/Layout'

function App() {
  return (
    <div className="app-container">
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