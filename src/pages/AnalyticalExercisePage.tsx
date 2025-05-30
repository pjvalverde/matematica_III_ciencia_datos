import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const AnalyticalExercisePage = () => {
  const { weekId, exerciseId } = useParams();
  const questions = [
  {
    question: 'Sea f(x, y) = ln(xy). ¿Cuál es el dominio de f?',
    options: [
      'x > 0, y > 0',
      'x ≠ 0, y ≠ 0',
      'x ≥ 0, y ≥ 0',
      'x < 0, y < 0',
    ],
    correct: 'x > 0, y > 0',
  },
  {
    question: '¿Cuál es el valor de la derivada parcial ∂/∂y de f(x, y) = x²y³ en (1,2)?',
    options: [
      '12',
      '6',
      '8',
      '4',
    ],
    correct: '12',
  },
  {
    question: 'Sea F(x, y) = (y, x). ¿Cuál es el rotacional de F?',
    options: [
      '0',
      '2',
      '-2',
      '1',
    ],
    correct: '-2',
  },
  {
    question: '¿Cuál es el valor de la integral doble ∫∫_D (x + y) dA sobre el cuadrado D: 0 ≤ x ≤ 1, 0 ≤ y ≤ 1?',
    options: [
      '1',
      '2',
      '0.5',
      '4',
    ],
    correct: '1',
  },
  {
    question: '¿Cuál de las siguientes afirmaciones es verdadera sobre el gradiente?',
    options: [
      'Siempre apunta en la dirección de máximo crecimiento de la función',
      'Siempre es perpendicular al eje x',
      'Es igual a la divergencia',
      'No existe para funciones continuas',
    ],
    correct: 'Siempre apunta en la dirección de máximo crecimiento de la función',
  },
];
  const [answers, setAnswers] = useState<(string | null)[]>(Array(5).fill(null));
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  const correctCount = answers.filter((a, i) => a === questions[i].correct).length;
  const auth = getAuth();
  const db = getFirestore();

  async function handleComplete() {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    await setDoc(doc(db, 'exerciseCompletions', `${userId}_w${weekId}_e${exerciseId}`), {
      userId,
      weekId,
      exerciseId,
      correctCount,
      timestamp: new Date().toISOString()
    });
    setCompleted(true);
  }

  function handleAnswer(qIdx: number, option: string) {
    if (completed) return;
    const newAns = [...answers];
    newAns[qIdx] = option;
    setAnswers(newAns);
    setShowFeedback(true);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/semana/${weekId}`} className="text-primary-600 hover:underline">
          &larr; Volver a Semana {weekId}
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Ejercicio Analítico {exerciseId}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">Quiz de opción múltiple</h2>
        {questions.map((q, i) => (
          <div key={i} className="mb-6">
            <p className="mb-2 font-medium">{i + 1}. {q.question}</p>
            <div className="flex flex-wrap gap-2 mb-1">
              {q.options.map((o, j) => (
                <button
                  key={j}
                  className={`px-3 py-1 rounded border ${answers[i] === o ? (o === q.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-gray-100 hover:bg-blue-100'}`}
                  disabled={answers[i] !== null || completed}
                  onClick={() => handleAnswer(i, o)}
                >
                  {o}
                </button>
              ))}
            </div>
            {answers[i] && (
              <span className={answers[i] === q.correct ? 'text-green-600' : 'text-red-600'}>
                {answers[i] === q.correct ? '¡Correcto!' : `Incorrecto. Respuesta correcta: ${q.correct}`}
              </span>
            )}
          </div>
        ))}
        <button
          className={`mt-4 px-4 py-2 rounded font-bold ${correctCount >= 4 && answers.every(a => a !== null) && !completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!(correctCount >= 4 && answers.every(a => a !== null)) || completed}
          onClick={handleComplete}
        >
          {completed ? '¡Ejercicio completado!' : 'Marcar como completado'}
        </button>
        {showFeedback && !(correctCount >= 4 && answers.every(a => a !== null)) && !completed && (
          <div className="mt-4 text-red-600 font-semibold">Debes responder correctamente al menos 4 de 5 preguntas para completar el ejercicio.</div>
        )}
        {completed && <div className="mt-4 text-green-600 font-semibold">¡Tu progreso se ha guardado!</div>}
      </div>
    </div>
  );
};

export default AnalyticalExercisePage; 