import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const CodeExercisePage = () => {
  const { weekId, exerciseId } = useParams();
  const [code, setCode] = useState(`# Completa la función en Python puro

def calcular_gradiente(x, y):
    # Tu código aquí
    pass
`);
  type Feedback = { passed: number; total: number; details: string[] } | null;
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  // Cargar Pyodide solo una vez
  React.useEffect(() => {
    if (!(window as any).pyodideLoaded) {
      setLoading(true);
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
      script.onload = async () => {
        // @ts-ignore
        window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/' }).then((pyodide: any) => {
          setPyodide(pyodide);
          (window as any).pyodideLoaded = true;
          setLoading(false);
        });
      };
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/' }).then((pyodide: any) => {
        setPyodide(pyodide);
        setLoading(false);
      });
    }
  }, []);

  async function handleSubmit() {
    setLoading(true);
    if (!pyodide) {
      setFeedback({ passed: 0, total: 3, details: ['Pyodide aún no está listo. Espera unos segundos y reintenta.'] });
      setLoading(false);
      return;
    }
    const tests = [
      { input: [2, 1], expected: [5, 6] },
      { input: [1, 2], expected: [6, 5] },
      { input: [0, 0], expected: [0, 0] },
    ];
    let passed = 0;
    let details: string[] = [];
    try {
      await pyodide.runPythonAsync(code + '\nresultado = []\nfor x, y in [(2,1),(1,2),(0,0)]:\n    resultado.append(tuple(calcular_gradiente(x, y)))');
      const result: any[] = pyodide.globals.get('resultado').toJs();
      tests.forEach((t, i) => {
        if (Array.isArray(result[i]) && result[i][0] === t.expected[0] && result[i][1] === t.expected[1]) {
          passed++;
          details.push(`Test ${i+1}: OK (input ${t.input} → output ${result[i]})`);
        } else {
          details.push(`Test ${i+1}: Falló (input ${t.input} → output ${result[i]}, esperado ${t.expected})`);
        }
      });
    } catch (e: any) {
      details = ["Error de ejecución: " + e.message];
    }
    setFeedback({ passed, total: 3, details });
    setLoading(false);
  }

  async function handleComplete() {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    await setDoc(doc(db, 'codeExerciseCompletions', `${userId}_w${weekId}_e${exerciseId}`), {
      userId,
      weekId,
      exerciseId,
      timestamp: new Date().toISOString()
    });
    setCompleted(true);
  }

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

        {loading && (
          <div className="mb-4 text-blue-600 font-semibold">Ejecutando código y corriendo tests, espera...</div>
        )}

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
            <div>
              {feedback.details.map((d, idx) => (
                <div key={idx} className={d.includes('OK') ? 'text-green-700' : 'text-red-700'}>
                  {d}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-end items-center">
          <button
            onClick={handleSubmit}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            disabled={loading}
          >
            Ejecutar código
          </button>
          <button
            onClick={handleComplete}
            className={`px-4 py-2 rounded-md font-bold ${feedback && feedback.passed === feedback.total && !completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!(feedback && feedback.passed === feedback.total) || completed}
          >
            {completed ? '¡Completado y guardado!' : 'Marcar como completado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeExercisePage; 