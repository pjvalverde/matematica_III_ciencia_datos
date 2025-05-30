import React from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore, ACTIVITY_POINTS, MINIMUM_PASSING_SCORE } from '../store/progressStore';

// Tipos de actividades y sus íconos
const ACTIVITY_ICONS = {
  lesson: '📚',  // Lecciones
  exercise: '📝', // Ejercicios
  code: '💻',     // Práctica de código
  quiz: '🧠'      // Cuestionario final
};

interface ModuleActivity {
  id: string;
  title: string;
  type: 'lesson' | 'exercise' | 'code' | 'quiz';
  locked: boolean;
  completed: boolean;
  path?: string;
}

interface ModuleActivitiesProps {
  weekId: string;
  moduleId: string; 
  activities: ModuleActivity[];
  onActivityClick: (activity: ModuleActivity) => void;
}

const ModuleActivities = ({ weekId, moduleId, activities, onActivityClick }: ModuleActivitiesProps) => {
  const { completedActivities, getModuleScore, isModulePassed } = useProgressStore();
  
  // Obtener puntuación actual del módulo
  const moduleScore = getModuleScore(Number(weekId), Number(moduleId));
  const isPassed = isModulePassed(Number(weekId), Number(moduleId));
  
  // Calcular la puntuación máxima posible
  const maxScore = activities.reduce((total, activity) => {
    return total + (ACTIVITY_POINTS[activity.type] || 0);
  }, 0);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Actividades del módulo</h3>
        <div className="text-sm font-medium">
          <span>Puntuación: </span>
          <span className={isPassed ? 'text-green-600' : 'text-amber-600'}>
            {moduleScore}/{maxScore}
          </span>
          <span className="ml-2 text-gray-600">Mínimo: {MINIMUM_PASSING_SCORE}</span>
        </div>
      </div>
      
      {/* Actividades en formato horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activities.map((activity) => (
          <div 
            key={`${activity.type}-${activity.id}`}
            className={`border rounded-lg overflow-hidden ${
              activity.completed ? 'border-green-300 bg-green-50' : 
              activity.locked ? 'border-gray-300 bg-gray-50 opacity-75' : 'border-blue-300 bg-blue-50'
            }`}
          >
            <div className="p-4">
              <div className="text-2xl mb-2">{ACTIVITY_ICONS[activity.type]}</div>
              <h4 className="font-medium mb-1 truncate">{activity.title}</h4>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {activity.type === 'lesson' ? 'Lección' : 
                  activity.type === 'exercise' ? 'Ejercicio' : 
                  activity.type === 'code' ? 'Práctica de código' : 'Cuestionario final'}
                </span>
                <span className="font-medium text-blue-600">{ACTIVITY_POINTS[activity.type]} pts</span>
              </div>
              
              {activity.locked ? (
                <div className="flex items-center justify-center text-gray-500 text-sm bg-gray-200 p-2 rounded">
                  <span className="mr-1">🔒</span> Bloqueado
                </div>
              ) : activity.completed ? (
                <div className="flex items-center justify-center text-green-600 text-sm bg-green-100 p-2 rounded">
                  <span className="mr-1">✓</span> Completado
                </div>
              ) : (
                <button
                  onClick={() => onActivityClick(activity)}
                  className="w-full text-sm bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors"
                >
                  Iniciar actividad
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleActivities; 