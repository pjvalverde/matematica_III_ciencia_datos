import { useState, useEffect } from 'react';
import type { ModuleActivity } from '../components/ModuleActivities';
import { useParams, useNavigate } from 'react-router-dom';
import ModuleActivities from '../components/ModuleActivities';
import ModuleQuiz from '../components/ModuleQuiz';
import { useProgressStore, MINIMUM_PASSING_SCORE } from '../store/progressStore';

// Datos simulados para módulos
const moduleData: { [key: string]: {
  id: string;
  title: string;
  description: string;
  activities: ModuleActivity[];
}} = {
  '1': {
    id: '1',
    title: 'Introducción al Cálculo Multivariante',
    description: 'Fundamentos y conceptos básicos del cálculo multivariante',
    activities: [
      {
        id: '1',
        title: 'Fundamentos matemáticos',
        type: 'lesson',
        content: `
          <h3>Fundamentos Matemáticos para Cálculo Multivariante</h3>
          <p>En esta lección aprenderás los conceptos fundamentales necesarios para entender el cálculo de múltiples variables.</p>
          <ul>
            <li>Repaso de funciones de una variable</li>
            <li>Concepto de espacio vectorial</li>
            <li>Introducción a las funciones de varias variables</li>
          </ul>
        `,
        locked: false,
        completed: false
      },
      {
        id: '2',
        title: 'Ejercicio: Dominios y rangos',
        type: 'exercise',
        content: `
          <h3>Ejercicio: Dominios y Rangos</h3>
          <p>Determina el dominio y rango de las siguientes funciones:</p>
          <ol>
            <li>f(x, y) = √(1 - x² - y²)</li>
            <li>g(x, y) = ln(x - y)</li>
            <li>h(x, y, z) = 1/(x² + y² + z²)</li>
          </ol>
        `,
        locked: false,
        completed: false
      },
      {
        id: '3',
        title: 'Visualización de funciones',
        type: 'code',
        content: `
          <h3>Práctica de Código: Visualización de Funciones</h3>
          <p>Implementa una visualización para la función f(x,y) = x² + y² usando Python y matplotlib.</p>
          <pre>
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Define la función
def f(x, y):
    return x**2 + y**2

# Crea una malla de puntos
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
X, Y = np.meshgrid(x, y)
Z = f(X, Y)

# Visualiza la superficie
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')
surface = ax.plot_surface(X, Y, Z, cmap='viridis')
plt.show()
          </pre>
        `,
        locked: false,
        completed: false
      },
      {
        id: '4',
        title: 'Cuestionario final',
        type: 'quiz',
        questions: [
          {
            id: '1',
            question: '¿Cuál es el dominio de la función f(x,y) = √(1-x²-y²)?',
            options: [
              'Todos los números reales (x,y)',
              'Los puntos (x,y) tales que x² + y² ≤ 1',
              'Los puntos (x,y) tales que x² + y² < 1',
              'Los puntos (x,y) tales que x² + y² > 1'
            ],
            correctAnswer: 1
          },
          {
            id: '2',
            question: 'Si f(x,y) = x²y + xy², ¿cuál es ∂f/∂x?',
            options: [
              '2xy + y²',
              'x² + 2xy',
              '2xy',
              'x² + y²'
            ],
            correctAnswer: 0
          },
          {
            id: '3',
            question: 'Para la función f(x,y) = e^(x+y), el valor de ∂²f/∂x∂y es:',
            options: [
              'e^(x+y)',
              '0',
              'e^x + e^y',
              'ye^(x+y)'
            ],
            correctAnswer: 0
          },
          {
            id: '4',
            question: 'La representación gráfica de f(x,y) = x² + y² corresponde a:',
            options: [
              'Un plano',
              'Un paraboloide elíptico',
              'Un hiperboloide',
              'Una esfera'
            ],
            correctAnswer: 1
          },
          {
            id: '5',
            question: 'Si v = (3,4) y w = (1,2), entonces v·w (producto escalar) es:',
            options: [
              '11',
              '5',
              '(3,8)',
              '(4,6)'
            ],
            correctAnswer: 0
          }
        ],
        locked: false,
        completed: false
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Vectores y Espacio Vectorial',
    description: 'Conceptos y aplicaciones de los vectores en el cálculo multivariante',
    activities: [
      {
        id: '1',
        title: 'Fundamentos matemáticos',
        type: 'lesson',
        content: `
          <h3>Fundamentos de Vectores y Espacio Vectorial</h3>
          <p>En esta lección aprenderás los conceptos fundamentales de vectores y espacios vectoriales.</p>
          <ul>
            <li>Definición de vector y operaciones básicas</li>
            <li>Propiedades de los espacios vectoriales</li>
            <li>Bases y dimensión</li>
          </ul>
        `,
        locked: false,
        completed: false
      },
      {
        id: '2',
        title: 'Ejercicio: Operaciones vectoriales',
        type: 'exercise',
        content: `
          <h3>Ejercicio: Operaciones Vectoriales</h3>
          <p>Realiza las siguientes operaciones con vectores:</p>
          <ol>
            <li>Si u = (1,2,3) y v = (4,5,6), calcula u + v, u - v, y 2u</li>
            <li>Calcula el producto escalar u·v y la norma ||u||</li>
            <li>Determina si los vectores (1,1,1) y (2,2,2) son linealmente independientes</li>
          </ol>
        `,
        locked: false,
        completed: false
      },
      {
        id: '3',
        title: 'Visualización de vectores',
        type: 'code',
        content: `
          <h3>Práctica de Código: Visualización de Vectores</h3>
          <p>Implementa la visualización de vectores en el espacio 3D usando Python y matplotlib.</p>
          <pre>
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Definir vectores
u = np.array([1, 2, 3])
v = np.array([4, 5, 6])
w = u + v

# Crear figura 3D
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Dibujar vectores como flechas desde el origen
# Vector u
ax.quiver(0, 0, 0, u[0], u[1], u[2], color='r', arrow_length_ratio=0.1, label='u')

# Vector v
ax.quiver(0, 0, 0, v[0], v[1], v[2], color='g', arrow_length_ratio=0.1, label='v')

# Vector w = u + v
ax.quiver(0, 0, 0, w[0], w[1], w[2], color='b', arrow_length_ratio=0.1, label='u+v')

# Configurar gráfico
ax.set_xlim([0, max(u[0], v[0], w[0])+1])
ax.set_ylim([0, max(u[1], v[1], w[1])+1])
ax.set_zlim([0, max(u[2], v[2], w[2])+1])
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')
ax.legend()
plt.title('Visualización de Vectores en 3D')
plt.show()
          </pre>
        `,
        locked: false,
        completed: false
      },
      {
        id: '4',
        title: 'Cuestionario final',
        type: 'quiz',
        questions: [
          {
            id: '1',
            question: '¿Cuál de las siguientes opciones define un espacio vectorial?',
            options: [
              'Cualquier conjunto de vectores',
              'Un conjunto con operaciones de suma y multiplicación por escalar que cumplen axiomas específicos',
              'Un conjunto de números reales',
              'Un sistema de ecuaciones lineales'
            ],
            correctAnswer: 1
          },
          {
            id: '2',
            question: 'Si u = (2,3,4) y v = (1,0,2), ¿cuál es el producto escalar u·v?',
            options: [
              '5',
              '8', 
              '10',
              '12'
            ],
            correctAnswer: 2
          },
          {
            id: '3',
            question: 'La norma del vector (3,4) es:',
            options: [
              '5',
              '7',
              '25',
              '3.5'
            ],
            correctAnswer: 0
          },
          {
            id: '4',
            question: 'Dos vectores son ortogonales si:',
            options: [
              'Son paralelos',
              'Tienen la misma longitud',
              'Su producto escalar es cero',
              'Su suma es el vector nulo'
            ],
            correctAnswer: 2
          },
          {
            id: '5',
            question: 'El producto vectorial u×v en R³ es:',
            options: [
              'Un número real',
              'Un vector perpendicular a u y v',
              'La suma de u y v',
              'Un escalar que representa el área del paralelogramo formado por u y v'
            ],
            correctAnswer: 1
          }
        ],
        locked: false,
        completed: false
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Derivadas Parciales',
    description: 'Conceptos y aplicaciones de las derivadas parciales',
    activities: [
      {
        id: '1',
        title: 'Concepto de derivada parcial',
        type: 'lesson',
        content: `
          <h3>Concepto de Derivada Parcial</h3>
          <p>En esta lección aprenderás qué son las derivadas parciales y cómo calcularlas.</p>
          <ul>
            <li>Definición de derivada parcial</li>
            <li>Interpretación geométrica</li>
            <li>Cálculo de derivadas parciales</li>
          </ul>
        `,
        locked: false,
        completed: false
      },
      {
        id: '2',
        title: 'Ejercicio: Cálculo de derivadas parciales',
        type: 'exercise',
        content: `
          <h3>Ejercicio: Cálculo de Derivadas Parciales</h3>
          <p>Calcula las derivadas parciales de las siguientes funciones:</p>
          <ol>
            <li>f(x,y) = x²y + y³</li>
            <li>g(x,y) = e^(x+y) + ln(xy)</li>
            <li>h(x,y,z) = x²y + yz + xz²</li>
          </ol>
        `,
        locked: false,
        completed: false
      },
      {
        id: '3',
        title: 'Visualización de derivadas parciales',
        type: 'code',
        content: `
          <h3>Práctica de Código: Visualización de Derivadas Parciales</h3>
          <p>Implementa un programa en Python para visualizar derivadas parciales.</p>
          <pre>
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import sympy as sp

# Definir variables simbólicas
x, y = sp.symbols('x y')

# Definir la función
f = x**2 + y**2

# Calcular derivadas parciales simbólicamente
df_dx = sp.diff(f, x)
df_dy = sp.diff(f, y)

# Convertir a funciones numéricas para matplotlib
f_lambda = sp.lambdify((x, y), f, 'numpy')
df_dx_lambda = sp.lambdify((x, y), df_dx, 'numpy')
df_dy_lambda = sp.lambdify((x, y), df_dy, 'numpy')

# Crear una malla de puntos
x_vals = np.linspace(-2, 2, 100)
y_vals = np.linspace(-2, 2, 100)
X, Y = np.meshgrid(x_vals, y_vals)
Z = f_lambda(X, Y)

# Calcular derivadas parciales en la malla
DZ_DX = df_dx_lambda(X, Y)
DZ_DY = df_dy_lambda(X, Y)

# Crear figura con subfiguras
fig = plt.figure(figsize=(18, 6))

# Función original
ax1 = fig.add_subplot(131, projection='3d')
surf = ax1.plot_surface(X, Y, Z, cmap='viridis', alpha=0.8)
ax1.set_title('Función f(x,y) = x² + y²')
ax1.set_xlabel('x')
ax1.set_ylabel('y')
ax1.set_zlabel('f(x,y)')

# Derivada parcial respecto a x
ax2 = fig.add_subplot(132, projection='3d')
surf_dx = ax2.plot_surface(X, Y, DZ_DX, cmap='plasma', alpha=0.8)
ax2.set_title('Derivada parcial ∂f/∂x = 2x')
ax2.set_xlabel('x')
ax2.set_ylabel('y')
ax2.set_zlabel('∂f/∂x')

# Derivada parcial respecto a y
ax3 = fig.add_subplot(133, projection='3d')
surf_dy = ax3.plot_surface(X, Y, DZ_DY, cmap='inferno', alpha=0.8)
ax3.set_title('Derivada parcial ∂f/∂y = 2y')
ax3.set_xlabel('x')
ax3.set_ylabel('y')
ax3.set_zlabel('∂f/∂y')

plt.tight_layout()
plt.show()
          </pre>
        `,
        locked: false,
        completed: false
      },
      {
        id: '4',
        title: 'Cuestionario final',
        type: 'quiz',
        questions: [
          {
            id: '1',
            question: 'La derivada parcial de f(x,y) = x²y con respecto a x es:',
            options: [
              '2xy',
              'x²',
              'y',
              '2x'
            ],
            correctAnswer: 0
          },
          {
            id: '2',
            question: 'La interpretación geométrica de la derivada parcial ∂f/∂x en un punto (a,b) es:',
            options: [
              'La pendiente de la tangente a la curva que resulta de la intersección de la superficie z=f(x,y) con el plano x=a',
              'La pendiente de la tangente a la curva que resulta de la intersección de la superficie z=f(x,y) con el plano y=b',
              'La tasa de cambio de f en dirección del vector unitario i',
              'La tasa de cambio de f en dirección del vector unitario j'
            ],
            correctAnswer: 1
          },
          {
            id: '3',
            question: 'Si f(x,y) = e^(x+y), entonces ∂²f/∂x∂y es:',
            options: [
              'e^(x+y)',
              '0',
              'e^x + e^y',
              'ye^(x+y)'
            ],
            correctAnswer: 0
          },
          {
            id: '4',
            question: 'La derivada parcial de f(x,y,z) = xyz con respecto a z es:',
            options: [
              'xy',
              'xz',
              'yz',
              'x+y+z'
            ],
            correctAnswer: 0
          },
          {
            id: '5',
            question: 'Para la función f(x,y) = ln(x²+y²), el valor de ∂f/∂x en el punto (1,1) es:',
            options: [
              '1',
              '1/2',
              '2',
              '1/√2'
            ],
            correctAnswer: 1
          }
        ],
        locked: false,
        completed: false
      }
    ]
  },
  '4': {
    id: '4',
    title: 'Gradiente y Derivadas Direccionales',
    description: 'Aplicaciones del gradiente en el análisis de funciones multivariantes',
    activities: [
      {
        id: '1',
        title: 'Fundamentos del gradiente',
        type: 'lesson',
        content: `
          <h3>Fundamentos del Gradiente</h3>
          <p>En esta lección aprenderás sobre el gradiente y su importancia en cálculo multivariante.</p>
          <ul>
            <li>Definición del vector gradiente</li>
            <li>Interpretación geométrica</li>
            <li>Propiedades del gradiente</li>
          </ul>
        `,
        locked: false,
        completed: false
      },
      {
        id: '2',
        title: 'Ejercicio: Cálculo de gradientes',
        type: 'exercise',
        content: `
          <h3>Ejercicio: Cálculo de Gradientes</h3>
          <p>Calcula el gradiente de las siguientes funciones y evalúalo en los puntos indicados:</p>
          <ol>
            <li>f(x,y) = x² + 2xy + y², en el punto (1,2)</li>
            <li>g(x,y,z) = xe^(y+z), en el punto (1,0,0)</li>
            <li>h(x,y) = ln(x² + y²), en el punto (3,4)</li>
          </ol>
        `,
        locked: false,
        completed: false
      },
      {
        id: '3',
        title: 'Visualización de gradientes',
        type: 'code',
        content: `
          <h3>Práctica de Código: Visualización de Gradientes</h3>
          <p>Implementa un programa en Python para visualizar el campo gradiente de una función.</p>
          <pre>
import numpy as np
import matplotlib.pyplot as plt

# Definir la función
def f(x, y):
    return x**2 + y**2

# Definir el gradiente
def grad_f(x, y):
    return np.array([2*x, 2*y])

# Crear una malla de puntos
x = np.linspace(-2, 2, 10)
y = np.linspace(-2, 2, 10)
X, Y = np.meshgrid(x, y)
Z = f(X, Y)

# Calcular los componentes del gradiente en cada punto
U = np.zeros_like(X)
V = np.zeros_like(Y)

for i in range(len(x)):
    for j in range(len(y)):
        grad = grad_f(X[i,j], Y[i,j])
        U[i,j] = grad[0]
        V[i,j] = grad[1]

# Crear la visualización
plt.figure(figsize=(10, 8))

# Dibujar curvas de nivel
contour = plt.contour(X, Y, Z, 20, cmap='viridis')
plt.clabel(contour, inline=True, fontsize=8)

# Dibujar el campo de gradiente como vectores
plt.quiver(X, Y, U, V, color='r', scale=50)

plt.title('Campo Gradiente de f(x,y) = x² + y²')
plt.xlabel('x')
plt.ylabel('y')
plt.grid(True)
plt.axis('equal')
plt.show()
          </pre>
        `,
        locked: false,
        completed: false
      },
      {
        id: '4',
        title: 'Cuestionario final',
        type: 'quiz',
        questions: [
          {
            id: '1',
            question: 'El gradiente de una función escalar f es:',
            options: [
              'Un número real',
              'Un vector con componentes que son las derivadas parciales de f',
              'Una matriz',
              'Un tensor'
            ],
            correctAnswer: 1
          },
          {
            id: '2',
            question: 'El gradiente de f(x,y) = x²y + xy² en el punto (1,1) es:',
            options: [
              '(3,3)',
              '(2,2)',
              '(1,1)',
              '(4,4)'
            ],
            correctAnswer: 0
          },
          {
            id: '3',
            question: 'La dirección de máximo crecimiento de una función f en un punto P está dada por:',
            options: [
              'La dirección del vector posición de P',
              'La dirección del gradiente de f en P',
              'La dirección de la tangente a la curva de nivel en P',
              'La dirección perpendicular al gradiente en P'
            ],
            correctAnswer: 1
          },
          {
            id: '4',
            question: 'La derivada direccional de f en la dirección de un vector unitario u es:',
            options: [
              'El producto punto entre ∇f y u',
              'El producto cruz entre ∇f y u',
              'La magnitud de ∇f',
              'La proyección de u sobre ∇f'
            ],
            correctAnswer: 0
          },
          {
            id: '5',
            question: 'Si el gradiente de f en un punto es cero, entonces ese punto es:',
            options: [
              'Siempre un máximo',
              'Siempre un mínimo',
              'Un punto crítico (puede ser máximo, mínimo o punto de silla)',
              'Un punto de inflexión'
            ],
            correctAnswer: 2
          }
        ],
        locked: false,
        completed: false
      }
    ]
  }
};


const ModulePage = () => {
  const { weekId, moduleId } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'overview' | 'activity'>('overview');
  const [activeActivity, setActiveActivity] = useState<ModuleActivity | null>(null);
  const { completedActivities, getModuleScore, isModulePassed, completeActivity, completeWeek } = useProgressStore();
  
  // Función para desbloquear el siguiente módulo
  const handleUnlockNextModule = () => {
    // Marcar la semana actual como completada si todos los módulos están completados
    if (Number(moduleId) === Object.keys(moduleData).length) {
      completeWeek(Number(weekId));
    }
    
    // Navegar a la página de la semana
    navigate(`/semana/${weekId}`);
  };
  
  // Obtener los datos del módulo actual
  const module = moduleId ? moduleData[moduleId] : null;
  
  // Estado para controlar el progreso del usuario
  const [activities, setActivities] = useState<ModuleActivity[]>([]);
  
  useEffect(() => {
    if (module) {
      // Procesar las actividades para determinar cuáles están bloqueadas
      const moduleKey = `${weekId}:${moduleId}`;
      const userProgress = completedActivities[moduleKey] || {
        lessons: [],
        exercises: [],
        code: [],
        quiz: false,
        totalScore: 0
      };
      
      const processedActivities = module.activities.map((activity: ModuleActivity, index: number) => {
        let isCompleted = false;
        let isLocked = false;
        
        // Verificar si la actividad está completada
        if (activity.type === 'lesson') {
          isCompleted = userProgress.lessons.includes(activity.id);
        } else if (activity.type === 'exercise') {
          isCompleted = userProgress.exercises.includes(activity.id);
        } else if (activity.type === 'code') {
          isCompleted = userProgress.code.includes(activity.id);
        } else if (activity.type === 'quiz') {
          isCompleted = userProgress.quiz;
        }
        
        // Verificar si la actividad está bloqueada
        // El quiz está bloqueado hasta que todas las demás actividades estén completadas
        if (activity.type === 'quiz') {
          const nonQuizActivities = module.activities.filter(a => a.type !== 'quiz');
          const completedNonQuizCount = nonQuizActivities.reduce((count: number, act: ModuleActivity) => {
            if (act.type === 'lesson' && userProgress.lessons.includes(act.id)) return count + 1;
            if (act.type === 'exercise' && userProgress.exercises.includes(act.id)) return count + 1;
            if (act.type === 'code' && userProgress.code.includes(act.id)) return count + 1;
            return count;
          }, 0);
          
          isLocked = completedNonQuizCount < nonQuizActivities.length;
        } 
        // Las demás actividades siguen un orden secuencial
        else if (index > 0) {
          const prevActivity = module.activities[index - 1];
          
          if (prevActivity.type === 'lesson') {
            isLocked = !userProgress.lessons.includes(prevActivity.id);
          } else if (prevActivity.type === 'exercise') {
            isLocked = !userProgress.exercises.includes(prevActivity.id);
          } else if (prevActivity.type === 'code') {
            isLocked = !userProgress.code.includes(prevActivity.id);
          }
        }
        
        return {
          ...activity,
          locked: isLocked,
          completed: isCompleted
        };
      });
      
      setActivities(processedActivities);
    }
  }, [weekId, moduleId, module, completedActivities]);
  
  if (!module) {
    return <div>Módulo no encontrado</div>;
  }
  
  const handleActivityClick = (activity: ModuleActivity): void => {
    if (activity.locked) return;
    
    setActiveActivity(activity);
    setActiveView('activity');
  };
  
  const handleCompleteActivity = (activity: ModuleActivity): void => {
    if (!weekId || !moduleId) return;
    
    completeActivity(Number(weekId), Number(moduleId), activity.type, activity.id);
    
    // Actualizamos la actividad a completada en el estado local
    setActivities(activities.map(act => 
      act.id === activity.id && act.type === activity.type
        ? { ...act, completed: true }
        : act
    ));
  };
  
  const handleQuizComplete = () => {
    setActiveView('overview');
    setActiveActivity(null);
  };
  
  // Renderizar la vista de resumen del módulo
  if (activeView === 'overview') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
        <p className="text-gray-600 mb-4">{module.description}</p>
        
        {/* Mostrar el botón para desbloquear y avanzar al siguiente módulo si se alcanza la puntuación mínima */}
        {isModulePassed(Number(weekId), Number(moduleId)) && Number(moduleId) < 4 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-green-700 font-medium">¡Felicidades! Has completado este módulo con éxito.</h3>
              <p className="text-green-600">Puntuación: {getModuleScore(Number(weekId), Number(moduleId))}/50 (Mínimo: {MINIMUM_PASSING_SCORE})</p>
            </div>
            <button
              onClick={handleUnlockNextModule}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Desbloquear siguiente módulo
            </button>
          </div>
        )}
        
        {/* Visualización de actividades en formato horizontal */}
        <ModuleActivities 
          weekId={weekId ?? ''} 
          moduleId={moduleId ?? ''}
          activities={activities}
          onActivityClick={handleActivityClick}
        />
        
        {/* Resumen del módulo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Acerca de este módulo</h2>
          <p className="mb-4">
            Este módulo contiene {activities.filter(a => a.type === 'lesson').length} lecciones, 
            {activities.filter(a => a.type === 'exercise').length} ejercicios, 
            {activities.filter(a => a.type === 'code').length} prácticas de código y 
            un cuestionario final para evaluar tu aprendizaje.
          </p>
          
          <p className="mb-4">
            Debes completar las actividades en orden y obtener al menos {MINIMUM_PASSING_SCORE} puntos para 
            aprobar el módulo y desbloquear el siguiente.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h3 className="font-medium text-blue-800 mb-2">Requisitos para aprobar</h3>
            <ul className="list-disc list-inside text-blue-800">
              <li>Completar las lecciones (5 puntos cada una)</li>
              <li>Realizar los ejercicios (5 puntos cada uno)</li>
              <li>Implementar las prácticas de código (10 puntos cada una)</li>
              <li>Aprobar el cuestionario final (hasta 30 puntos)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar la vista de actividad individual
  if (activeView === 'activity' && activeActivity) {
    // Si es un cuestionario, mostrar el componente de cuestionario
    if (activeActivity.type === 'quiz') {
      // Quiz activity: Type assertion for questions property
      return (
        <ModuleQuiz 
          weekId={weekId ?? ''}
          moduleId={moduleId ?? ''}
          title={activeActivity.title}
          questions={(activeActivity as any).questions}
          onComplete={handleQuizComplete}
        />
      );
    }
    
    // Renderizar lección interactiva si es tipo 'lesson'
    if (activeActivity.type === 'lesson') {
      // Se asume que LessonPage ya usa los parámetros de la lección actual
      // Puedes pasar weekId y lessonId si LessonPage los requiere
      return <LessonPage />;
    }

    // Para otros tipos de actividades
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{activeActivity.title}</h2>
          {/* Contenido de la actividad */}
          {'content' in activeActivity && activeActivity.content && (
            <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: activeActivity.content }} />
          )}
          {/* Botón para marcar como completada */}
          {'completed' in activeActivity && !activeActivity.completed && (
            <button
              onClick={() => {
                handleCompleteActivity(activeActivity);
                setActiveView('overview');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Marcar como completado
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return <div>Cargando...</div>;
};

export default ModulePage; 