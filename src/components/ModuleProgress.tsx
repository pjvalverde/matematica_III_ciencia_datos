import React from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore, MINIMUM_PASSING_SCORE } from '../store/progressStore';

interface ModuleProgressProps {
  weekId: string;
  moduleId: string;
  title: string;
  description: string;
}

const ModuleProgress = ({ weekId, moduleId, title, description }: ModuleProgressProps) => {
  const { completedActivities, isModulePassed, getModuleScore } = useProgressStore();
  
  // Obtener el progreso del módulo
  const moduleKey = `${weekId}:${moduleId}`;
  const moduleProgress = completedActivities[moduleKey] || {
    lessons: [],
    exercises: [],
    code: [],
    quiz: false,
    totalScore: 0
  };
  
  // Calcular estadísticas
  const totalScore = getModuleScore(Number(weekId), Number(moduleId));
  const passed = isModulePassed(Number(weekId), Number(moduleId));
  const passPercent = Math.min(100, Math.round((totalScore / MINIMUM_PASSING_SCORE) * 100));
  
  // Contadores de actividades
  const lessonsCompleted = moduleProgress.lessons.length;
  const exercisesCompleted = moduleProgress.exercises.length;
  const codeCompleted = moduleProgress.code.length;
  const quizCompleted = moduleProgress.quiz;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        {/* Barra de progreso */}
        <div className="flex items-center mb-3">
          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className={`h-2 rounded-full ${passed ? 'bg-green-500' : 'bg-blue-500'}`} 
              style={{ width: `${passPercent}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">
            {totalScore}/{MINIMUM_PASSING_SCORE}
          </span>
        </div>
        
        {/* Iconos de actividades */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-2">
            <div className="flex flex-col items-center">
              <span className={`text-lg ${lessonsCompleted > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                📚
              </span>
              <span className="text-xs mt-1">{lessonsCompleted}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-lg ${exercisesCompleted > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                📝
              </span>
              <span className="text-xs mt-1">{exercisesCompleted}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-lg ${codeCompleted > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                💻
              </span>
              <span className="text-xs mt-1">{codeCompleted}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-lg ${quizCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                🧠
              </span>
              <span className="text-xs mt-1">{quizCompleted ? '1' : '0'}</span>
            </div>
          </div>
          
          {passed && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Aprobado
            </span>
          )}
        </div>
      </div>
      
      {/* Botón de acceso al módulo */}
      <Link 
        to={`/semana/${weekId}/modulo/${moduleId}`}
        className="block border-t px-5 py-3 text-center text-blue-600 hover:bg-blue-50 font-medium"
      >
        {passed ? 'Revisar módulo' : 'Continuar aprendizaje'}
      </Link>
    </div>
  );
};

export default ModuleProgress; 