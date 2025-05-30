import { create } from 'zustand';

// Define los tipos de actividades y sus valores de puntos
export const ACTIVITY_POINTS = {
  lesson: 5,        // Lecciones: 5 puntos
  exercise: 5,      // Ejercicios: 5 puntos
  code: 10,         // Práctica de código: 10 puntos
  quiz: 30,         // Cuestionario final: 30 puntos
};

// Puntuación mínima requerida para pasar al siguiente módulo
export const MINIMUM_PASSING_SCORE = 30;

interface ProgressState {
  completedWeeks: number[];
  completedLessons: string[]; // formato: "weekId:lessonId"
  completedActivities: {
    [moduleId: string]: {
      lessons: string[];
      exercises: string[];
      code: string[];
      quiz: boolean;
      totalScore: number;
      [key: string]: any; // <-- index signature para evitar error TS7053
    };
  };
  badges: string[];
  xp: number;
  completeLesson: (weekId: number, lessonId: number, type?: string) => void;
  completeActivity: (weekId: number, moduleId: number, activityType: 'lesson' | 'exercise' | 'code' | 'quiz', activityId: string) => void;
  completeWeek: (weekId: number) => void;
  completeQuiz: (weekId: number, moduleId: number, score: number) => void;
  earnXP: (amount: number) => void;
  earnBadge: (badgeId: string) => void;
  getModuleScore: (weekId: number, moduleId: number) => number;
  isModulePassed: (weekId: number, moduleId: number) => boolean;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  // Datos iniciales para propósitos de demostración
  completedWeeks: [1], // La semana 1 está completada
  completedLessons: ['1:lesson-1'], // Solo la primera lección completada para probar el sistema de desbloqueo
  completedActivities: {
    '1:1': { // Semana 1, Módulo 1
      lessons: ['1'],
      exercises: [],
      code: [],
      quiz: false,
      totalScore: 5 // Solo una lección completada (5 puntos)
    }
  },
  badges: ['week-1', 'minimalista'], // Algunas medallas ganadas
  xp: 250, // Puntos de experiencia acumulados
  
  completeLesson: (weekId, lessonId, type = 'lesson') => set((state) => {
    // Crear la clave de lección según el tipo
    let lessonKey = '';
    if (type === 'lesson') {
      lessonKey = `${weekId}:lesson-${lessonId}`;
    } else if (type === 'exercise-analitico') {
      lessonKey = `${weekId}:exercise-analitico-${lessonId}`;
    } else if (type === 'exercise-codigo') {
      lessonKey = `${weekId}:exercise-codigo-${lessonId}`;
    } else if (type === 'challenge') {
      lessonKey = `${weekId}:challenge-${lessonId}`;
    } else {
      lessonKey = `${weekId}:${lessonId}`;
    }
    
    if (state.completedLessons.includes(lessonKey)) {
      return state; // No hacer nada si la lección ya está completada
    }
    
    return {
      completedLessons: [...state.completedLessons, lessonKey],
      xp: state.xp + 20 // Dar XP por completar lección
    };
  }),
  
  completeActivity: (weekId, moduleId, activityType, activityId) => set((state) => {
    const moduleKey = `${weekId}:${moduleId}`;
    const moduleActivities = state.completedActivities[moduleKey] || {
      lessons: [],
      exercises: [],
      code: [],
      quiz: false,
      totalScore: 0
    };
    
    // Verificar si la actividad ya está completada
    if (activityType === 'quiz') {
      if (moduleActivities.quiz) return state;
    } else {
      if (moduleActivities[activityType]?.includes(activityId)) return state;
    }
    
    // Actualizar las actividades completadas
    const updatedModuleActivities = { ...moduleActivities };
    let pointsEarned = 0;
    
    if (activityType === 'quiz') {
      updatedModuleActivities.quiz = true;
      pointsEarned = ACTIVITY_POINTS.quiz;
    } else if (activityType === 'lesson') {
      updatedModuleActivities.lessons = [...moduleActivities.lessons, activityId];
      pointsEarned = ACTIVITY_POINTS.lesson;
    } else if (activityType === 'exercise') {
      updatedModuleActivities.exercises = [...moduleActivities.exercises, activityId];
      pointsEarned = ACTIVITY_POINTS.exercise;
    } else if (activityType === 'code') {
      updatedModuleActivities.code = [...moduleActivities.code, activityId];
      pointsEarned = ACTIVITY_POINTS.code;
    }
    
    updatedModuleActivities.totalScore += pointsEarned;
    
    // También guardamos el estado de la lección como completada para desbloqueo
    const newCompletedLessons = [...state.completedLessons];
    if (activityType === 'lesson') {
      const lessonKey = `${weekId}:lesson-${activityId}`;
      if (!newCompletedLessons.includes(lessonKey)) {
        newCompletedLessons.push(lessonKey);
      }
    }
    
    return {
      completedActivities: {
        ...state.completedActivities,
        [moduleKey]: updatedModuleActivities
      },
      completedLessons: newCompletedLessons,
      xp: state.xp + pointsEarned
    };
  }),
  
  completeQuiz: (weekId, moduleId, score) => set((state) => {
    const moduleKey = `${weekId}:${moduleId}`;
    const moduleActivities = state.completedActivities[moduleKey] || {
      lessons: [],
      exercises: [],
      code: [],
      quiz: false,
      totalScore: 0
    };
    
    // Si el quiz ya está completado, no hacer nada
    if (moduleActivities.quiz) return state;
    
    // Actualizar el quiz como completado y agregar su puntuación
    const updatedModuleActivities = { ...moduleActivities };
    updatedModuleActivities.quiz = true;
    updatedModuleActivities.totalScore += score;
    
    return {
      completedActivities: {
        ...state.completedActivities,
        [moduleKey]: updatedModuleActivities
      },
      xp: state.xp + score
    };
  }),
  
  completeWeek: (weekId) => set((state) => {
    if (state.completedWeeks.includes(weekId)) {
      return state; // No hacer nada si la semana ya está completada
    }
    
    return {
      completedWeeks: [...state.completedWeeks, weekId],
      xp: state.xp + 100, // Dar XP por completar semana
      badges: [...state.badges, `week-${weekId}`] // Dar badge por completar semana
    };
  }),
  
  earnXP: (amount) => set((state) => ({
    xp: state.xp + amount
  })),
  
  earnBadge: (badgeId) => set((state) => {
    if (state.badges.includes(badgeId)) {
      return state; // No hacer nada si el badge ya fue obtenido
    }
    
    return {
      badges: [...state.badges, badgeId]
    };
  }),
  
  getModuleScore: (weekId, moduleId) => {
    const state = get();
    const moduleKey = `${weekId}:${moduleId}`;
    return state.completedActivities[moduleKey]?.totalScore || 0;
  },
  
  isModulePassed: (weekId, moduleId) => {
    const state = get();
    const moduleKey = `${weekId}:${moduleId}`;
    const score = state.completedActivities[moduleKey]?.totalScore || 0;
    return score >= MINIMUM_PASSING_SCORE;
  }
})); 