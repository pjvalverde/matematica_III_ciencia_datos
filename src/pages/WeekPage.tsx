import { useParams, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';

// Datos simulados de módulos
const modules = {
  '1': [
    {
      id: '1',
      title: 'Introducción al Cálculo Multivariante',
      description: 'Fundamentos y conceptos básicos del cálculo multivariante'
    },
    {
      id: '2',
      title: 'Vectores y Espacio Vectorial',
      description: 'Conceptos y aplicaciones de los vectores en el cálculo multivariante'
    },
    {
      id: '3',
      title: 'Derivadas Parciales',
      description: 'Conceptos y aplicaciones de las derivadas parciales'
    },
    {
      id: '4',
      title: 'Gradiente y Derivadas Direccionales',
      description: 'Aplicaciones del gradiente en el análisis de funciones multivariantes'
    }
  ],
  '2': [
    {
      id: '1',
      title: 'Optimización en Varias Variables',
      description: 'Encontrar máximos y mínimos de funciones multivariantes'
    }
  ]
};

// Datos simulados más completos
const weeklyContent = {
  '1': {
    title: 'Introducción y Derivadas Parciales',
    description: 'Conceptos fundamentales del cálculo multivariante y sus aplicaciones en ciencia de datos',
    calendar: [
      {
        day: 'Lun 26/05',
        title: 'Presentación del curso',
        description: 'Repaso de cálculo de una variable, motivación del cálculo multivariable en ciencia de datos. Ejercicios diagnósticos y ejemplo en Python.'
      },
      {
        day: 'Mar 27/05',
        title: 'Definición y cálculo de derivadas parciales',
        description: 'Interpretación geométrica y ejemplo práctico con SymPy.'
      },
      {
        day: 'Mié 28/05',
        title: 'Gradiente y derivadas direccionales',
        description: 'Visualización con curvas de nivel con Matplotlib.'
      },
      {
        day: 'Vie 30/05',
        title: 'Regla de la cadena multivariable y Jacobiano',
        description: 'Ejemplos de transformación cartesiana a polar.'
      }
    ],
    lessons: [
      { 
        id: '1', 
        title: 'Introducción al Cálculo Multivariante',
        content: `
          <h3>Introducción al Cálculo Multivariante</h3>
          <p>El cálculo multivariante extiende los conceptos del cálculo de una variable a funciones con varias variables independientes.</p>
          
          <h4 class="mt-4">Importancia en Ciencia de Datos</h4>
          <p>En ciencia de datos, el cálculo multivariante es fundamental para:</p>
          <ul class="list-disc pl-6 my-3">
            <li><strong>Optimización:</strong> Encontrar mínimos/máximos en algoritmos de aprendizaje automático</li>
            <li><strong>Regresión multivariable:</strong> Analizar relaciones entre múltiples variables</li>
            <li><strong>Reducción de dimensionalidad:</strong> Técnicas como PCA utilizan conceptos del cálculo multivariante</li>
            <li><strong>Redes neuronales:</strong> El descenso de gradiente es central en el entrenamiento de redes</li>
          </ul>
          
          <h4 class="mt-4">Funciones de Varias Variables</h4>
          <p>Una función de varias variables asigna a cada punto en R<sup>n</sup> un valor en R. Formalmente:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">f: R<sup>n</sup> → R</div>
          <p>Por ejemplo, f(x, y) = x² + y² asigna a cada par de números reales (x, y) un único número real.</p>
          
          <h4 class="mt-4">Ejemplos con Python</h4>
          <div class="p-4 bg-gray-100 rounded my-3">
            <code>
              import numpy as np<br>
              import matplotlib.pyplot as plt<br>
              from mpl_toolkits.mplot3d import Axes3D<br><br>
              
              # Definir la función f(x,y) = x² + y²<br>
              def f(x, y):<br>
              &nbsp;&nbsp;&nbsp;&nbsp;return x**2 + y**2<br><br>
              
              # Crear una malla de puntos<br>
              x = np.linspace(-5, 5, 100)<br>
              y = np.linspace(-5, 5, 100)<br>
              X, Y = np.meshgrid(x, y)<br>
              Z = f(X, Y)<br><br>
              
              # Visualizar la superficie<br>
              fig = plt.figure(figsize=(10, 8))<br>
              ax = fig.add_subplot(111, projection='3d')<br>
              surf = ax.plot_surface(X, Y, Z, cmap='viridis')<br>
              plt.show()<br>
            </code>
          </div>
        `
      },
      { 
        id: '2', 
        title: 'Vectores y Espacio Vectorial',
        content: `
          <h3>Vectores y Espacio Vectorial</h3>
          <p>Los vectores son elementos fundamentales en el cálculo multivariante.</p>
          
          <h4 class="mt-4">Definición de Vector</h4>
          <p>Un vector en R<sup>n</sup> es una n-tupla ordenada de números reales:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">v = (v₁, v₂, ..., vₙ)</div>
          
          <h4 class="mt-4">Operaciones Vectoriales</h4>
          <ul class="list-disc pl-6 my-3">
            <li><strong>Suma:</strong> (u₁, u₂, ..., uₙ) + (v₁, v₂, ..., vₙ) = (u₁+v₁, u₂+v₂, ..., uₙ+vₙ)</li>
            <li><strong>Multiplicación por escalar:</strong> c·(v₁, v₂, ..., vₙ) = (c·v₁, c·v₂, ..., c·vₙ)</li>
            <li><strong>Producto escalar:</strong> u·v = u₁v₁ + u₂v₂ + ... + uₙvₙ</li>
            <li><strong>Norma:</strong> ||v|| = √(v₁² + v₂² + ... + vₙ²)</li>
          </ul>
          
          <h4 class="mt-4">Geometría en R³</h4>
          <p>En el espacio tridimensional, algunos conceptos importantes son:</p>
          <ul class="list-disc pl-6 my-3">
            <li><strong>Distancia entre puntos:</strong> d((x₁,y₁,z₁), (x₂,y₂,z₂)) = √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)</li>
            <li><strong>Ecuaciones de planos:</strong> ax + by + cz + d = 0, donde (a,b,c) es el vector normal</li>
            <li><strong>Producto vectorial:</strong> u × v = (u₂v₃-u₃v₂, u₃v₁-u₁v₃, u₁v₂-u₂v₁)</li>
          </ul>
          
          <h4 class="mt-4">Ejemplos con Python</h4>
          <div class="p-4 bg-gray-100 rounded my-3">
            <code>
              import numpy as np<br><br>
              
              # Definir vectores<br>
              v = np.array([1, 2, 3])<br>
              u = np.array([4, 5, 6])<br><br>
              
              # Operaciones vectoriales<br>
              suma = v + u<br>
              producto_escalar = np.dot(v, u)<br>
              producto_vectorial = np.cross(v, u)<br>
              norma = np.linalg.norm(v)<br><br>
              
              print(f"Suma: {suma}")<br>
              print(f"Producto escalar: {producto_escalar}")<br>
              print(f"Producto vectorial: {producto_vectorial}")<br>
              print(f"Norma: {norma}")<br>
            </code>
          </div>
        `
      },
      { 
        id: '3', 
        title: 'Derivadas Parciales',
        content: `
          <h3>Derivadas Parciales</h3>
          <p>Las derivadas parciales son fundamentales para entender cómo cambia una función multivariable.</p>
          
          <h4 class="mt-4">Definición</h4>
          <p>La derivada parcial de una función f(x,y) con respecto a x es la derivada de f considerando y como constante:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">
            ∂f/∂x = lim(h→0) [f(x+h,y) - f(x,y)]/h
          </div>
          
          <p>De manera similar, la derivada parcial con respecto a y es:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">
            ∂f/∂y = lim(h→0) [f(x,y+h) - f(x,y)]/h
          </div>
          
          <h4 class="mt-4">Interpretación Geométrica</h4>
          <p>La derivada parcial ∂f/∂x representa la tasa de cambio de f cuando nos movemos a lo largo del eje x, manteniendo y constante. Geométricamente, es la pendiente de la curva que resulta de la intersección de la superficie z=f(x,y) con el plano y=constante.</p>
          
          <h4 class="mt-4">Cálculo de Derivadas Parciales</h4>
          <p>Para calcular derivadas parciales, aplicamos las reglas de derivación del cálculo de una variable, tratando las otras variables como constantes.</p>
          <p>Ejemplo: Si f(x,y) = x² + xy + y³, entonces:</p>
          <div class="p-4 bg-gray-100 rounded my-3">
            ∂f/∂x = 2x + y<br>
            ∂f/∂y = x + 3y²
          </div>
          
          <h4 class="mt-4">Derivadas Parciales de Orden Superior</h4>
          <p>Las derivadas parciales también pueden derivarse nuevamente, obteniendo derivadas de segundo orden o superior:</p>
          <div class="p-4 bg-gray-100 rounded my-3">
            ∂²f/∂x² = ∂/∂x(∂f/∂x)<br>
            ∂²f/∂x∂y = ∂/∂x(∂f/∂y) = ∂/∂y(∂f/∂x)<br>
            ∂²f/∂y² = ∂/∂y(∂f/∂y)
          </div>
          
          <h4 class="mt-4">Ejemplos con Python (SymPy)</h4>
          <div class="p-4 bg-gray-100 rounded my-3">
            <code>
              import sympy as sp<br><br>
              
              # Definir variables simbólicas<br>
              x, y = sp.symbols('x y')<br><br>
              
              # Definir la función<br>
              f = x**2 + x*y + y**3<br><br>
              
              # Calcular derivadas parciales<br>
              df_dx = sp.diff(f, x)<br>
              df_dy = sp.diff(f, y)<br>
              df_dxdy = sp.diff(df_dx, y)<br><br>
              
              print(f"f(x,y) = {f}")<br>
              print(f"∂f/∂x = {df_dx}")<br>
              print(f"∂f/∂y = {df_dy}")<br>
              print(f"∂²f/∂x∂y = {df_dxdy}")<br>
            </code>
          </div>
        `
      },
      { 
        id: '4', 
        title: 'Gradiente y Derivadas Direccionales',
        content: `
          <h3>Gradiente y Derivadas Direccionales</h3>
          <p>El gradiente es un vector que apunta en la dirección de máximo crecimiento de una función.</p>
          
          <h4 class="mt-4">Definición del Gradiente</h4>
          <p>El gradiente de una función f(x,y) es un vector cuyas componentes son las derivadas parciales de la función:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">
            ∇f(x,y) = (∂f/∂x, ∂f/∂y)
          </div>
          
          <p>En el caso general para f(x₁, x₂, ..., xₙ):</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">
            ∇f = (∂f/∂x₁, ∂f/∂x₂, ..., ∂f/∂xₙ)
          </div>
          
          <h4 class="mt-4">Propiedades del Gradiente</h4>
          <ul class="list-disc pl-6 my-3">
            <li>El gradiente es perpendicular a las curvas de nivel de la función</li>
            <li>La magnitud del gradiente indica la tasa de cambio en la dirección de máximo crecimiento</li>
            <li>En un punto crítico (máximo, mínimo o punto de silla), el gradiente es cero</li>
          </ul>
          
          <h4 class="mt-4">Derivadas Direccionales</h4>
          <p>La derivada direccional es la tasa de cambio de la función en la dirección de un vector unitario u:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">
            D<sub>u</sub>f = ∇f · u = |∇f| · |u| · cos(θ)
          </div>
          <p>donde θ es el ángulo entre ∇f y u.</p>
          
          <h4 class="mt-4">Visualización con Curvas de Nivel</h4>
          <p>Las curvas de nivel son conjuntos de puntos donde la función tiene un valor constante.</p>
          <p>Ejemplo: Para f(x,y) = x² + y², las curvas de nivel son círculos centrados en el origen.</p>
          
          <h4 class="mt-4">Ejemplos con Matplotlib</h4>
          <div class="p-4 bg-gray-100 rounded my-3">
            <code>
              import numpy as np<br>
              import matplotlib.pyplot as plt<br><br>
              
              # Definir la función y su gradiente<br>
              def f(x, y):<br>
              &nbsp;&nbsp;&nbsp;&nbsp;return x**2 + y**2<br><br>
              
              def grad_f(x, y):<br>
              &nbsp;&nbsp;&nbsp;&nbsp;return np.array([2*x, 2*y])<br><br>
              
              # Crear una malla de puntos<br>
              x = np.linspace(-5, 5, 100)<br>
              y = np.linspace(-5, 5, 100)<br>
              X, Y = np.meshgrid(x, y)<br>
              Z = f(X, Y)<br><br>
              
              # Visualizar curvas de nivel<br>
              plt.figure(figsize=(10, 8))<br>
              plt.contour(X, Y, Z, 20)<br>
              
              # Visualizar gradientes en algunos puntos<br>
              x_points = np.linspace(-4, 4, 8)<br>
              y_points = np.linspace(-4, 4, 8)<br>
              X_pts, Y_pts = np.meshgrid(x_points, y_points)<br><br>
              
              U = np.zeros_like(X_pts)<br>
              V = np.zeros_like(Y_pts)<br><br>
              
              for i in range(len(x_points)):<br>
              &nbsp;&nbsp;&nbsp;&nbsp;for j in range(len(y_points)):<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;grad = grad_f(X_pts[i,j], Y_pts[i,j])<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;norm = np.linalg.norm(grad)<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if norm > 0:<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U[i,j] = grad[0]/norm<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;V[i,j] = grad[1]/norm<br><br>
              
              plt.quiver(X_pts, Y_pts, U, V)<br>
              plt.xlabel('x')<br>
              plt.ylabel('y')<br>
              plt.title('Curvas de nivel y campo gradiente')<br>
              plt.axis('equal')<br>
              plt.grid(True)<br>
              plt.show()<br>
            </code>
          </div>
        `
      },
      { 
        id: '5', 
        title: 'Regla de la Cadena',
        content: `
          <h3>Regla de la Cadena Multivariable y Jacobiano</h3>
          <p>La regla de la cadena es fundamental para calcular derivadas de funciones compuestas.</p>
          
          <h4 class="mt-4">Regla de la Cadena para Funciones de Varias Variables</h4>
          <p>Si z = f(x,y) donde x = g(t) y y = h(t), entonces:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">
            dz/dt = (∂f/∂x)(dx/dt) + (∂f/∂y)(dy/dt)
          </div>
          
          <p>En general, si z = f(x₁, x₂, ..., xₙ) donde cada xᵢ es función de variables t₁, t₂, ..., tₘ, entonces:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">
            ∂z/∂tⱼ = ∑(i=1 to n) (∂f/∂xᵢ)(∂xᵢ/∂tⱼ)
          </div>
          
          <h4 class="mt-4">Matriz Jacobiana</h4>
          <p>La matriz Jacobiana es una generalización de la derivada para funciones vectoriales. Si F: R<sup>n</sup> → R<sup>m</sup> es una función vectorial con componentes (f₁, f₂, ..., fₘ), la matriz Jacobiana es:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">
            J = [ ∂fᵢ/∂xⱼ ]<br><br>
            
            J = | ∂f₁/∂x₁ ∂f₁/∂x₂ ... ∂f₁/∂xₙ |<br>
            &nbsp;&nbsp;&nbsp;&nbsp;| ∂f₂/∂x₁ ∂f₂/∂x₂ ... ∂f₂/∂xₙ |<br>
            &nbsp;&nbsp;&nbsp;&nbsp;| ...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;... |<br>
            &nbsp;&nbsp;&nbsp;&nbsp;| ∂fₘ/∂x₁ ∂fₘ/∂x₂ ... ∂fₘ/∂xₙ |
          </div>
          
          <h4 class="mt-4">Transformación de Coordenadas</h4>
          <p>La matriz Jacobiana es crucial en transformaciones de coordenadas. Por ejemplo, para transformar de coordenadas cartesianas (x,y) a polares (r,θ):</p>
          <div class="p-4 bg-gray-100 rounded my-3">
            x = r·cos(θ)<br>
            y = r·sin(θ)
          </div>
          
          <p>La matriz Jacobiana de esta transformación es:</p>
          <div class="p-4 bg-gray-100 rounded my-3 font-mono">
            J = | ∂x/∂r ∂x/∂θ | = | cos(θ) -r·sin(θ) |<br>
            &nbsp;&nbsp;&nbsp;&nbsp;| ∂y/∂r ∂y/∂θ | &nbsp;&nbsp;| sin(θ) r·cos(θ) |
          </div>
          
          <h4 class="mt-4">Ejemplo con SymPy</h4>
          <div class="p-4 bg-gray-100 rounded my-3">
            <code>
              import sympy as sp<br>
              import numpy as np<br><br>
              
              # Definir variables simbólicas<br>
              r, theta = sp.symbols('r theta')<br><br>
              
              # Transformación de coordenadas polares a cartesianas<br>
              x = r * sp.cos(theta)<br>
              y = r * sp.sin(theta)<br><br>
              
              # Calcular las derivadas parciales<br>
              dx_dr = sp.diff(x, r)<br>
              dx_dtheta = sp.diff(x, theta)<br>
              dy_dr = sp.diff(y, r)<br>
              dy_dtheta = sp.diff(y, theta)<br><br>
              
              # Construir la matriz Jacobiana<br>
              J = sp.Matrix([[dx_dr, dx_dtheta], [dy_dr, dy_dtheta]])<br><br>
              
              print("Matriz Jacobiana:")<br>
              print(J)<br><br>
              
              # Calcular el determinante (Jacobiano)<br>
              det_J = J.det()<br><br>
              
              print("Determinante Jacobiano:")<br>
              print(det_J)<br>
              print("Simplificado:")<br>
              print(sp.simplify(det_J))<br>
            </code>
          </div>
        `
      }
    ],
    exercises: [
      { 
        id: '1', 
        type: 'analitico', 
        title: 'Dominios y visualización',
        description: 'Determina el dominio y dibuja las curvas de nivel de la función f(x,y) = √(1-x²-y²)',
        hint: 'Recuerda que para la raíz cuadrada, el radicando debe ser mayor o igual a cero. ¿Qué figura geométrica representa la frontera del dominio?'
      },
      { 
        id: '2', 
        type: 'analitico', 
        title: 'Cálculo de derivadas parciales',
        description: 'Calcula las derivadas parciales de primer orden de f(x,y) = xe^(xy) + y·ln(x)',
        hint: 'Utiliza la regla del producto y la regla de la cadena cuando sea necesario.'
      },
      { 
        id: '3', 
        type: 'analitico', 
        title: 'Gradiente y dirección de máximo crecimiento',
        description: 'Para la función f(x,y) = x² - y² + 2xy, encuentra el gradiente en el punto (1,2) y determina la dirección de máximo crecimiento en ese punto.',
        hint: 'El gradiente indica la dirección de máximo crecimiento. Para encontrarlo, calcula las derivadas parciales y evalúalas en el punto dado.'
      },
      { 
        id: '4', 
        type: 'codigo', 
        title: 'Visualización de funciones en Python',
        description: 'Implementa una función en Python que visualice la función f(x,y) = x²+y² y sus curvas de nivel en el rango [-5,5]×[-5,5].',
        startingCode: `import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Crear una malla de puntos
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
X, Y = np.meshgrid(x, y)

# Define la función
def f(x, y):
    # Implementa la función f(x,y) = x²+y²
    return # Tu código aquí

# Calcula los valores de la función
Z = f(X, Y)

# Crear dos subplots
fig = plt.figure(figsize=(12, 5))

# Visualizar la superficie 3D
ax1 = fig.add_subplot(121, projection='3d')
# Tu código aquí para mostrar la superficie 3D

# Visualizar las curvas de nivel
ax2 = fig.add_subplot(122)
# Tu código aquí para mostrar las curvas de nivel

plt.tight_layout()
plt.show()`
      },
      { 
        id: '5', 
        type: 'codigo', 
        title: 'Cálculo de derivadas con SymPy',
        description: 'Utiliza SymPy para calcular las derivadas parciales de f(x,y) = sin(x*y) + e^(x+y) y evalúalas en el punto (0,0).',
        startingCode: `import sympy as sp

# Define las variables simbólicas
x, y = sp.symbols('x y')

# Define la función
f = sp.sin(x*y) + sp.exp(x+y)

# Calcula las derivadas parciales
# Tu código aquí

# Evalúa las derivadas en el punto (0,0)
# Tu código aquí

# Muestra los resultados
print("f(x,y) =", f)
print("∂f/∂x en (0,0) =", # Tu resultado aquí)
print("∂f/∂y en (0,0) =", # Tu resultado aquí)`
      }
    ],
    challenges: [
      { 
        id: '1', 
        title: 'Tarea 1: Derivadas parciales y gradiente',
        description: 'Para la función f(x,y,z) = x²yz + xy²z + xyz², encuentra el gradiente ∇f y demuestra que en cualquier punto (x,y,z) ≠ (0,0,0), el vector posición r = (x,y,z) y el gradiente ∇f son paralelos. Entrega: 9 de junio.',
        hint: 'Calcula las derivadas parciales, forma el gradiente y verifica si es proporcional al vector posición (x,y,z).'
      }
    ]
  },
  '2': {
    title: 'Derivadas Parciales',
    description: 'Diferenciación en múltiples variables y sus aplicaciones',
    calendar: [
      {
        day: 'Lun 02/06',
        title: 'Repaso de derivadas parciales',
        description: 'Aplicaciones en problemas prácticos.'
      },
      {
        day: 'Mar 03/06',
        title: 'Regla de la cadena multivariable',
        description: 'Ejemplos y ejercicios.'
      }
    ]
  }
};

const WeekPage = () => {
  const params = useParams();
  const location = useLocation();
  const weekId = params.weekId;
  const [activeSection, setActiveSection] = useState('overview');
  const { isModulePassed } = useProgressStore();
  
  const user = useAuthStore(state => state.user);
  const isWeek1 = weekId === '1';

  // Obtener la sección activa del estado de localización si está disponible
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location.state]);

  console.log("Parámetros de ruta:", params);
  console.log("WeekID:", weekId);
  console.log("Sección activa:", activeSection);
  
  // Obtener datos de la semana actual
  const weekData = weeklyContent[weekId as keyof typeof weeklyContent] || {
    title: `Semana ${weekId}`,
    description: 'Contenido en desarrollo',
    calendar: []
  };

  // Obtener módulos para esta semana
  const weekModules = modules[weekId as keyof typeof modules] || [];

  // Verificar si un módulo es accesible
  const isModuleAccessible = (moduleId) => {
    if (moduleId === '1') return true;
    
    // Para los módulos siguientes, verificar si el módulo anterior está aprobado
    const prevModuleId = String(Number(moduleId) - 1);
    return isModulePassed(Number(weekId), Number(prevModuleId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      <h1 className="text-3xl font-bold mb-2">{weekData.title}</h1>
      <p className="text-gray-600 mb-6">{weekData.description}</p>
      
      {/* Módulos de la semana en formato horizontal */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Módulos de la semana</h2>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {weekModules.map((module) => {
            const isAccessible = isModuleAccessible(module.id);
            
            return (
              <div key={module.id} className={`bg-white rounded-lg border ${isAccessible ? 'border-primary-300' : 'border-gray-200'} p-5 ${isAccessible ? 'shadow-md' : ''}`}>
                <h3 className="text-lg font-semibold mb-1">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                
                {/* Bloques de tareas del módulo */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-blue-500 mr-2">📚</span>
                    <span>Fundamentos</span>
                    <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">5 pts</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-orange-500 mr-2">📝</span>
                    <span>Ejercicio</span>
                    <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">5 pts</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-purple-500 mr-2">💻</span>
                    <span>Visualización</span>
                    <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">10 pts</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">🧠</span>
                    <span>Cuestionario final</span>
                    <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">30 pts</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  {isAccessible ? (
                    <Link
                      to={`/semana/${weekId}/modulo/${module.id}`}
                      className={`w-full block text-center py-3 px-4 rounded-md font-medium transition-colors ${
                        // Si es el módulo 1 o el único próximo que está desbloqueado, resaltarlo más
                        module.id === '1' || (
                          Number(module.id) > 1 && 
                          isModulePassed(Number(weekId), Number(module.id)-1) && 
                          !isModulePassed(Number(weekId), Number(module.id))
                        ) 
                          ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="inline-flex items-center">
                        <span className="mr-2">🔓</span> 
                        {module.id === '1' ? 'Comenzar este módulo' : isModulePassed(Number(weekId), Number(module.id)) ? 'Módulo Completado' : 'Módulo Desbloqueado'} - Click para Acceder
                      </span>
                    </Link>
                  ) : (
                    <div className="w-full text-center">
                      <span className="block text-gray-400 bg-gray-100 py-3 px-4 rounded-md cursor-not-allowed">
                        <span className="mr-2">🔒</span>
                        Módulo bloqueado
                      </span>
                      <p className="text-xs text-gray-500 mt-2">Complete el módulo anterior para desbloquear</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendario de la semana */}
      {weekData.calendar && weekData.calendar.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Calendario de la semana</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {weekData.calendar.map((day, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md border-l-4 border-primary-600">
                <div className="font-bold text-gray-700">{day.day}</div>
                <div className="font-medium text-primary-700 mb-2">{day.title}</div>
                <div className="text-sm text-gray-600">{day.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekPage; 