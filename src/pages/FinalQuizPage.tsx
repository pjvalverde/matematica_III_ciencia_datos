import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';

const questions = [
  {
    question: 'Sea f(x, y) = e^{x^2 + y^2}. ¿Cuál es el gradiente ∇f?',
    options: [
      '(2xe^{x^2+y^2}, 2ye^{x^2+y^2})',
      '(e^{x^2+y^2}, e^{x^2+y^2})',
      '(2x, 2y)',
      '(x^2, y^2)',
    ],
    correct: '(2xe^{x^2+y^2}, 2ye^{x^2+y^2})',
  },
  {
    question: '¿Cuál es el valor de la integral doble ∫∫_D x dA, donde D es el cuadrado 0 ≤ x ≤ 1, 0 ≤ y ≤ 1?',
    options: [
      '0.5',
      '1',
      '2',
      '0',
    ],
    correct: '0.5',
  },
  {
    question: 'Si F(x, y) = (y, -x), ¿cuál es el rotacional de F?',
    options: [
      '-2',
      '0',
      '2',
      '1',
    ],
    correct: '-2',
  },
  {
    question: '¿Cuál de las siguientes funciones es diferenciable en todo R²?',
    options: [
      'f(x, y) = x^2 + y^2',
      'f(x, y) = |x| + |y|',
      'f(x, y) = 1/(x^2 + y^2)',
      'f(x, y) = ln(xy)',
    ],
    correct: 'f(x, y) = x^2 + y^2',
  },
  {
    question: '¿Para qué valores de (x, y) es nulo el gradiente de f(x, y) = x^2 + y^2?',
    options: [
      '(0, 0)',
      '(1, 1)',
      '(1, 0)',
      '(0, 1)',
    ],
    correct: '(0, 0)',
  },
  {
    question: '¿Cuál es el valor de la derivada parcial ∂/∂x de f(x, y) = x^2y + y^2 en (2, 1)?',
    options: [
      '4',
      '2',
      '1',
      '5',
    ],
    correct: '4',
  },
  {
    question: '¿Cuál es el dominio de la función f(x, y) = ln(x-y)?',
    options: [
      'x > y',
      'x < y',
      'x ≥ y',
      'x ≠ y',
    ],
    correct: 'x > y',
  },
  {
    question: 'Sea F(x, y) = (x^2, y^2). ¿Cuál es la divergencia de F?',
    options: [
      '2x + 2y',
      'x^2 + y^2',
      '2x',
      '2y',
    ],
    correct: '2x + 2y',
  },
  {
    question: '¿Cuál es el significado geométrico del gradiente?',
    options: [
      'Vector perpendicular a las curvas de nivel',
      'Área bajo la curva',
      'Valor máximo de la función',
      'El punto de inflexión',
    ],
    correct: 'Vector perpendicular a las curvas de nivel',
  },
  {
    question: '¿Cuál de las siguientes afirmaciones es verdadera sobre campos conservativos?',
    options: [
      'Su rotacional es siempre cero',
      'Su divergente es siempre cero',
      'No existen en R²',
      'Siempre son perpendiculares a las curvas de nivel',
    ],
    correct: 'Su rotacional es siempre cero',
  },
];

const FinalQuizPage = () => {
  const { weekId } = useParams();
  const [answers, setAnswers] = useState<(string|null)[]>(Array(10).fill(null));
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  const correctCount = answers.filter((a, i) => a === questions[i].correct).length;
  const canComplete = correctCount >= 7 && answers.every(a => a !== null);

  async function handleComplete() {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    await setDoc(doc(db, 'finalQuizCompletions', `${userId}_w${weekId}`), {
      userId,
      weekId,
      correctCount,
      timestamp: new Date().toISOString(),
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
      <h1 className="text-3xl font-bold mb-6">Cuestionario Final</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Responde las 10 preguntas (mínimo 7 correctas para aprobar)</h2>
        {questions.map((q, i) => (
          <div key={i} className="mb-4">
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
          className={`mt-4 px-4 py-2 rounded font-bold ${canComplete && !completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!canComplete || completed}
          onClick={handleComplete}
        >
          {completed ? '¡Cuestionario completado y guardado!' : 'Marcar como completado'}
        </button>
        {showFeedback && !canComplete && !completed && (
          <div className="mt-4 text-red-600 font-semibold">Debes responder correctamente al menos 7 de 10 preguntas para aprobar.</div>
        )}
        {completed && <div className="mt-4 text-green-600 font-semibold">¡Tu resultado se ha guardado!</div>}
      </div>
    </div>
  );
};

export default FinalQuizPage;
