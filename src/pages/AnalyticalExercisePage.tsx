import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const AnalyticalExercisePage = () => {
  const { weekId, exerciseId } = useParams();
  const [solution, setSolution] = useState('');
  const [feedback, setFeedback] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback({ 
      isCorrect: Math.random() > 0.5, 
      message: Math.random() > 0.5 
        ? 'Correcto! Tu solución es válida.' 
        : 'Incorrecto. Revisa tu trabajo e intenta nuevamente.' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/semana/${weekId}`} className="text-primary-600 hover:underline">
          &larr; Volver a Semana {weekId}
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Ejercicio Analítico {exerciseId}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Instrucciones</h2>
          <p className="text-gray-700">
            Resuelve el siguiente problema paso a paso utilizando el enfoque analítico.
          </p>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Problema:</h3>
          <p className="text-gray-800">
            Encuentra el gradiente de la función f(x, y) = x²y + xy² en el punto (2, 1).
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
              Tu respuesta (utiliza notación LaTeX simple para las fórmulas)
            </label>
            <textarea
              id="solution"
              rows={6}
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Escribe tu solución aquí..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            />
          </div>
          
          {feedback && (
            <div className={`p-4 mb-4 rounded-md ${feedback.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {feedback.message}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Enviar respuesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnalyticalExercisePage; 