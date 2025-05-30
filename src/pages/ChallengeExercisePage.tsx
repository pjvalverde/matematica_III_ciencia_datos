import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const ChallengeExercisePage = () => {
  const { weekId, challengeId } = useParams();
  const [code, setCode] = useState(`# Escribe tu solución aquí
import numpy as np

def optimizar_funcion(x0, y0, alpha=0.01, iteraciones=100):
    # Implementa el algoritmo de descenso de gradiente
    # para encontrar el mínimo de la función
    pass
`);
  const [analyticalSolution, setAnalyticalSolution] = useState('\\nabla f(x,y) = (2xy, x^2 + 2xy)');
  const [output, setOutput] = useState(null);
  const [step, setStep] = useState(1);
  
  const handleAnalyticalSubmit = () => {
    // Simular validación de solución analítica
    const isCorrect = analyticalSolution.includes('\\nabla f(x,y)') && 
                    analyticalSolution.includes('2xy') && 
                    analyticalSolution.includes('x^2 + 2xy');
    
    if (isCorrect) {
      setStep(2);
    } else {
      setOutput({
        passed: false,
        feedback: "Tu solución analítica no es correcta. Revisa las derivadas parciales."
      });
    }
  };

  const handleCodeSubmit = () => {
    // Simular ejecución de código
    const testsPassed = Math.floor(Math.random() * 5) + 1;
    const isAllPassed = testsPassed === 5;
    
    setOutput({
      passed: isAllPassed,
      testsPassed,
      totalTests: 5,
      feedback: isAllPassed
        ? "¡Excelente! Has completado el reto satisfactoriamente."
        : `Tu algoritmo pasa ${testsPassed}/5 tests. Sigue intentando.`
    });
    
    if (isAllPassed) {
      // En una app real, aquí guardaríamos el progreso
      console.log("Reto completado con éxito");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/semana/${weekId}`} className="text-primary-600 hover:underline">
          &larr; Volver a Semana {weekId}
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Reto {challengeId}: Optimización con Gradientes</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Descripción del Reto</h2>
          <p className="text-gray-700 mb-4">
            Este reto combina teoría y práctica. Primero deberás encontrar el gradiente de una función,
            y luego implementar un algoritmo de descenso de gradiente para encontrar su mínimo.
          </p>
          
          <div className="mb-6 p-4 bg-amber-50 rounded-lg">
            <h3 className="font-medium mb-2">Objetivo:</h3>
            <p>Optimizar la función <InlineMath math="f(x,y) = x^2y + xy^2" /> utilizando el método de descenso de gradiente.</p>
          </div>
        </div>
        
        {step === 1 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Paso 1: Encontrar el gradiente analíticamente</h3>
            <div className="mb-4">
              <p>Encuentra el gradiente de <InlineMath math="f(x,y) = x^2y + xy^2" /> e ingrésalo usando LaTeX:</p>
              <div className="h-24 border rounded-md p-3 mt-2">
                <textarea
                  className="w-full h-full resize-none"
                  value={analyticalSolution}
                  onChange={(e) => setAnalyticalSolution(e.target.value)}
                  placeholder="Escribe tu solución usando notación LaTeX..."
                />
              </div>
            </div>
            
            <div className="mb-4">
              <p className="mb-2">Vista previa:</p>
              <div className="p-4 bg-gray-50 rounded-md">
                <BlockMath math={analyticalSolution} />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAnalyticalSubmit}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Verificar y continuar
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Paso 2: Implementar el descenso de gradiente</h3>
            <p className="mb-4">
              Ahora que has calculado el gradiente <BlockMath math={analyticalSolution} />, implementa el algoritmo 
              de descenso de gradiente para encontrar el mínimo de la función.
            </p>
            <div className="h-80 border rounded-md overflow-hidden mb-4">
              <Editor
                height="100%"
                defaultLanguage="python"
                value={code}
                onChange={setCode}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleCodeSubmit}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Ejecutar y verificar
              </button>
            </div>
          </div>
        )}
        
        {output && (
          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Resultado:</h3>
            {output.testsPassed !== undefined && (
              <div className="mb-3">
                <div className="flex items-center">
                  <span className="font-medium">Tests pasados:</span>
                  <span className="ml-2">
                    {output.testsPassed}/{output.totalTests}
                  </span>
                </div>
              </div>
            )}
            <div className={`p-3 rounded-md ${output.passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {output.feedback}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeExercisePage; 