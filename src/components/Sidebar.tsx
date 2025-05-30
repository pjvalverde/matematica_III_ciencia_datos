import { Link, useLocation } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';

// Datos simulados más completos para el contenido de las semanas
const weeklyContent: { [key: string]: { title: string; lessons: { id: string; title: string }[]; hasExercisesAnalytical: boolean; hasExercisesCode: boolean; hasChallenges: boolean } } = {
  '1': {
    title: 'Introducción y Derivadas Parciales',
    lessons: [
      { id: '1', title: 'Introducción al Cálculo Multivariante' },
      { id: '2', title: 'Vectores y Espacio Vectorial' },
      { id: '3', title: 'Derivadas Parciales' },
      { id: '4', title: 'Gradiente y Derivadas Direccionales' },
      { id: '5', title: 'Regla de la Cadena' }
    ],
    hasExercisesAnalytical: true,
    hasExercisesCode: true,
    hasChallenges: true
  },
  '2': {
    title: 'Derivadas Parciales',
    lessons: [
      { id: '1', title: 'Concepto de derivada parcial' },
      { id: '2', title: 'Regla de la cadena' }
    ],
    hasExercisesAnalytical: true,
    hasExercisesCode: true,
    hasChallenges: true
  }
};

// Orden secuencial de los módulos en la semana 1
const moduleSequence = [
  { type: 'lesson', id: '1' },  // Introducción al Cálculo
  { type: 'lesson', id: '2' },  // Vectores y Espacio Vectorial
  { type: 'lesson', id: '3' },  // Derivadas Parciales
  { type: 'lesson', id: '4' },  // Gradiente y Derivadas Direccionales
  { type: 'lesson', id: '5' },  // Regla de la Cadena
  { type: 'exercises-analytical', id: null }, // Ejercicios Analíticos
  { type: 'exercises-code', id: null },      // Ejercicios de Código
  { type: 'challenges', id: null }           // Tarea de la Semana
];

const Sidebar = () => {
  const location = useLocation();
  
  const { completedWeeks, completedLessons } = useProgressStore();
  
  // Datos simulados de semanas (en una app real vendrían de una API/store)
  const weeks = [
  { id: 1, title: 'Introducción al Cálculo Multivariante' },
  { id: 2, title: 'Vectores y Espacio Vectorial' },
  { id: 3, title: 'Derivadas Parciales' },
  { id: 4, title: 'Gradientes y Direccionales' },
  { id: 5, title: 'Optimización' },
  { id: 6, title: 'Integrales Múltiples' },
  { id: 7, title: 'Teorema de Green y Stokes' },
  { id: 8, title: 'Aplicaciones en Ciencia de Datos' }
];
  
  // Verificar si una semana es accesible (completó la semana anterior o es la primera)
  const isAccessible = (weekId: string | number) => {
    const weekNum = typeof weekId === 'string' ? parseInt(weekId, 10) : weekId;
    if (weekNum === 1) return true;
    return completedWeeks.includes(weekNum - 1);
  };
  
  // Verificar si estamos en una página de semana específica
  const weekIdFromPath = location.pathname.match(/\/semana\/(\d+)/);
  const currentWeekId = weekIdFromPath ? weekIdFromPath[1] : null;
  const isInWeekPage = !!currentWeekId;
  const isWeek1 = currentWeekId === '1';
  
  // Obtener los datos de la semana actual si estamos en una página de semana
  const currentWeekData = isInWeekPage ? weeklyContent[currentWeekId] || null : null;

  // Verificar si un módulo está desbloqueado (para semana 1)
  const isModuleUnlocked = (moduleIndex: number) => {
    // Si no estamos en la semana 1, aplicamos reglas diferentes
    if (!isWeek1) return true;
    
    // El primer módulo siempre está desbloqueado
    if (moduleIndex === 0) return true;
    
    // Para los demás módulos, verificamos si el módulo anterior está completado
    const prevModule = moduleSequence[moduleIndex - 1];
    
    if (prevModule.type === 'lesson') {
      return completedLessons.includes(`1:lesson-${prevModule.id}`);
    } else if (prevModule.type === 'exercises-analytical') {
      // Verificar si al menos un ejercicio analítico está completado
      return completedLessons.some(lesson => lesson.startsWith('1:exercise-analitico'));
    } else if (prevModule.type === 'exercises-code') {
      // Verificar si al menos un ejercicio de código está completado
      return completedLessons.some(lesson => lesson.startsWith('1:exercise-codigo'));
    } else if (prevModule.type === 'challenges') {
      // Verificar si al menos un reto está completado
      return completedLessons.some(lesson => lesson.startsWith('1:challenge'));
    }
    
    return false;
  };

  // Verificar si un módulo está completado (para semana 1)
  const isModuleCompleted = (moduleType: string, moduleId: string | null) => {
    if (moduleType === 'lesson') {
      return completedLessons.includes(`1:lesson-${moduleId}`);
    } else if (moduleType === 'exercises-analytical') {
      // Un módulo de ejercicios analíticos se considera completado si al menos uno está completado
      return completedLessons.some(lesson => lesson.startsWith('1:exercise-analitico'));
    } else if (moduleType === 'exercises-code') {
      return completedLessons.some(lesson => lesson.startsWith('1:exercise-codigo'));
    } else if (moduleType === 'challenges') {
      return completedLessons.some(lesson => lesson.startsWith('1:challenge'));
    }
    return false;
  };

  // Si estamos en una página de semana y tenemos datos, mostrar el contenido específico
  if (isInWeekPage && currentWeekData) {
    // Si estamos en la semana 1, mostrar solo el título sin contenido
    if (isWeek1) {
      return (
        <aside className="w-64 bg-gray-100 p-4 hidden md:block">
          <h2 className="font-bold text-lg mb-4">Contenido de la semana</h2>
          <p className="text-sm text-gray-500">Los módulos y actividades se muestran en el panel principal.</p>
        </aside>
      );
    }
    
    // Para otras semanas, mantener el comportamiento original
    return (
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">
        <h2 className="font-bold text-lg mb-4">Contenido de la semana</h2>
        <nav>
          <ul className="space-y-1">
            {/* Lecciones */}
            {currentWeekData.lessons.map((lesson: any) => {
              // Determinar si esta lección está desbloqueada
              const moduleIndex = moduleSequence.findIndex(m => m.type === 'lesson' && m.id === lesson.id);
              const isUnlocked = isModuleUnlocked(moduleIndex);
              const isCompleted = isModuleCompleted('lesson', lesson.id);
              
              return (
                <li key={`lesson-${lesson.id}`}>
                  {isUnlocked ? (
                    <Link
                      to={`/semana/${currentWeekId}`}
                      state={{ activeSection: `lesson-${lesson.id}` }}
                      className={`
                        block p-2 rounded-md transition
                        ${location.pathname.includes(`/semana/${currentWeekId}`) &&
                          location.state?.activeSection === `lesson-${lesson.id}`
                          ? 'bg-primary-100 text-primary-800 font-medium' 
                          : 'hover:bg-gray-200'}
                        ${isCompleted ? 'text-green-700' : ''}
                      `}
                    >
                      {isCompleted && <span className="text-green-600 mr-1">✓</span>}
                      {lesson.title}
                    </Link>
                  ) : (
                    <div className="opacity-50 cursor-not-allowed block p-2 rounded-md bg-gray-200 flex items-center">
                      <span className="text-sm mr-2">🔒</span>
                      {lesson.title}
                      {isWeek1 && <span className="ml-2 text-xs bg-gray-300 px-1 py-0.5 rounded">Bloqueado</span>}
                    </div>
                  )}
                </li>
              );
            })}
            
            {/* Ejercicios Analíticos */}
            {currentWeekData.hasExercisesAnalytical && (
              <li>
                {isModuleUnlocked(moduleSequence.findIndex(m => m.type === 'exercises-analytical')) ? (
                  <Link
                    to={`/semana/${currentWeekId}`}
                    state={{ activeSection: 'exercises-analytical' }}
                    className={`
                      block p-2 rounded-md transition
                      ${location.pathname.includes(`/semana/${currentWeekId}`) &&
                        location.state?.activeSection === 'exercises-analytical'
                        ? 'bg-primary-100 text-primary-800 font-medium' 
                        : 'hover:bg-gray-200'}
                      ${isModuleCompleted('exercises-analytical', null) ? 'text-green-700' : ''}
                    `}
                  >
                    {isModuleCompleted('exercises-analytical', null) && <span className="text-green-600 mr-1">✓</span>}
                    Ejercicios Analíticos
                  </Link>
                ) : (
                  <div className="opacity-50 cursor-not-allowed block p-2 rounded-md bg-gray-200 flex items-center">
                    <span className="text-sm mr-2">🔒</span>
                    Ejercicios Analíticos
                    {isWeek1 && <span className="ml-2 text-xs bg-gray-300 px-1 py-0.5 rounded">Bloqueado</span>}
                  </div>
                )}
              </li>
            )}
            
            {/* Ejercicios de Código */}
            {currentWeekData.hasExercisesCode && (
              <li>
                {isModuleUnlocked(moduleSequence.findIndex(m => m.type === 'exercises-code')) ? (
                  <Link
                    to={`/semana/${currentWeekId}`}
                    state={{ activeSection: 'exercises-code' }}
                    className={`
                      block p-2 rounded-md transition
                      ${location.pathname.includes(`/semana/${currentWeekId}`) &&
                        location.state?.activeSection === 'exercises-code'
                        ? 'bg-primary-100 text-primary-800 font-medium' 
                        : 'hover:bg-gray-200'}
                      ${isModuleCompleted('exercises-code', null) ? 'text-green-700' : ''}
                    `}
                  >
                    {isModuleCompleted('exercises-code', null) && <span className="text-green-600 mr-1">✓</span>}
                    Ejercicios de Código
                  </Link>
                ) : (
                  <div className="opacity-50 cursor-not-allowed block p-2 rounded-md bg-gray-200 flex items-center">
                    <span className="text-sm mr-2">🔒</span>
                    Ejercicios de Código
                    {isWeek1 && <span className="ml-2 text-xs bg-gray-300 px-1 py-0.5 rounded">Bloqueado</span>}
                  </div>
                )}
              </li>
            )}
            
            {/* Tarea */}
            {currentWeekData.hasChallenges && (
              <li>
                {isModuleUnlocked(moduleSequence.findIndex(m => m.type === 'challenges')) ? (
                  <Link
                    to={`/semana/${currentWeekId}`}
                    state={{ activeSection: 'challenges' }}
                    className={`
                      block p-2 rounded-md transition
                      ${location.pathname.includes(`/semana/${currentWeekId}`) &&
                        location.state?.activeSection === 'challenges'
                        ? 'bg-primary-100 text-primary-800 font-medium' 
                        : 'hover:bg-gray-200'}
                      ${isModuleCompleted('challenges', null) ? 'text-green-700' : ''}
                    `}
                  >
                    {isModuleCompleted('challenges', null) && <span className="text-green-600 mr-1">✓</span>}
                    Tarea de la Semana
                  </Link>
                ) : (
                  <div className="opacity-50 cursor-not-allowed block p-2 rounded-md bg-gray-200 flex items-center">
                    <span className="text-sm mr-2">🔒</span>
                    Tarea de la Semana
                    {isWeek1 && <span className="ml-2 text-xs bg-gray-300 px-1 py-0.5 rounded">Bloqueado</span>}
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </aside>
    );
  }
  
  // Si no estamos en una página de semana, mostrar el sidebar normal con las semanas
  return (
    <aside className="w-64 bg-gray-100 p-4 hidden md:block">
      <h2 className="font-bold text-lg mb-4">Módulos</h2>
      <nav>
        <ul className="space-y-2">
          {weeks.map((week) => (
            <li key={week.id}>
              <Link
                to={`/semana/${week.id}`}
                className={`
                  block p-2 rounded-md transition
                  ${location.pathname.includes(`/semana/${week.id}`) 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'hover:bg-gray-200'}
                  ${!isAccessible(week.id) && 'opacity-50 cursor-not-allowed'}
                `}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => !isAccessible(week.id) && e.preventDefault()}
              >
                {week.title}
                {completedWeeks.includes(week.id) && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 