import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';

const CodeExercisePage = () => {
  const { weekId, exerciseId } = useParams();
  const [code, setCode] = useState(`# Escribe tu solución aquí
import numpy as np

def calcular_gradiente(x, y):
    # Tu código aquí
    pass
`);
  type Feedback = { passed: number; total: number; feedback: string } | null;
  const [feedback] = useState<Feedback>(null);
  
  const handleSubmit = () => {
    // Simular ejecución de código (en producción esto enviaría al backend)
    const isCorrect = Math.random() > 0.5;
    const testResults: Feedback = {
      passed: isCorrect ? 3 : Math.floor(Math.random() * 3),
      total: 3,
      feedback: isCorrect
        ? "¡Buen trabajo! Todos los tests han pasado."
        : "Hay errores en tu solución. Revisa los tests fallidos."
    };
    
    (testResults);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/semana/${weekId}`} className="text-primary-600 hover:underline">
          &larr; Volver a Semana {weekId}
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Ejercicio de Código {exerciseId}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Instrucciones</h2>
          <p className="text-gray-700 mb-4">
            Implementa una función que calcule el gradiente de la función f(x, y) = x²y + xy² en cualquier punto.
          </p>
          <p className="text-gray-700">
            Tu función debe tomar dos parámetros (x, y) y devolver una tupla con las derivadas parciales.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Editor de código</h3>
          <div className="h-80 border rounded-md overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>
        </div>
        
        {feedback && (
          <div className="mb-6 p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Resultado:</h3>
            <div className="mb-3">
              <div className="flex items-center">
                <span className="font-medium">Tests pasados:</span>
                <span className="ml-2">
                  {feedback.passed}/{feedback.total}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-md ${feedback.passed === feedback.total ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {feedback.feedback}
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Ejecutar código
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeExercisePage; 