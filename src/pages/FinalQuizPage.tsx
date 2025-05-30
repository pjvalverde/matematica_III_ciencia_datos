import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';

const questions = [
  // Teoría
  {
    question: '¿Qué estudia el cálculo multivariante?',
    options: [
      'Funciones de una variable',
      'Funciones de varias variables',
      'Números complejos',
      'Ecuaciones diferenciales'
    ],
    correct: 'Funciones de varias variables'
  },
  {
    question: '¿Qué es un gradiente?',
    options: [
      'Un número real',
      'Una integral',
      'Un vector de derivadas parciales',
      'Una constante'
    ],
    correct: 'Un vector de derivadas parciales'
  },
  {
    question: '¿Cuál es el significado geométrico del gradiente?',
    options: [
      'Área bajo la curva',
      'Dirección de máximo crecimiento',
      'Valor mínimo de la función',
      'Punto de inflexión'
    ],
    correct: 'Dirección de máximo crecimiento'
  },
  // Ejercicios
  {
    question: '¿Cuál es el gradiente de f(x, y) = x²y + xy² en (1, 1)?',
    options: [
      '(3, 3)',
      '(2, 2)',
      '(4, 4)',
      '(1, 1)'
    ],
    correct: '(4, 4)'
  },
  {
    question: '¿Para qué valores (x, y) es nulo el gradiente de f(x, y) = x² + y²?',
    options: [
      '(0, 0)',
      '(1, 1)',
      '(1, 0)',
      '(0, 1)'
    ],
    correct: '(0, 0)'
  },
  {
    question: '¿Cuál es el gradiente de f(x, y) = x³ + y³ en (2, 1)?',
    options: [
      '(12, 3)',
      '(6, 3)',
      '(3, 6)',
      '(2, 1)'
    ],
    correct: '(12, 3)'
  },
  {
    question: 'Si f(x, y) = x²y, ¿cuál es la derivada parcial respecto a x?',
    options: [
      '2xy',
      'x²',
      'y',
      'xy²'
    ],
    correct: '2xy'
  },
  {
    question: '¿Cuál es el dominio de f(x, y) = 1/(x+y)?',
    options: [
      'x+y ≠ 0',
      'x ≠ 0',
      'y ≠ 0',
      'x ≠ y'
    ],
    correct: 'x+y ≠ 0'
  },
  {
    question: '¿Cuál es el valor de la derivada parcial de f(x, y) = x² + y³ respecto a y en (1, 2)?',
    options: [
      '12',
      '6',
      '4',
      '3'
    ],
    correct: '12'
  },
  {
    question: '¿Cuál es el gradiente de f(x, y) = x² + y² en (1, 2)?',
    options: [
      '(2, 4)',
      '(1, 2)',
      '(2, 2)',
      '(4, 1)'
    ],
    correct: '(2, 4)'
  },
  {
    question: '¿Qué representa la notación f(x, y)?',
    options: [
      'Una función de una variable',
      'Una función de dos variables',
      'Una constante',
      'Un número primo'
    ],
    correct: 'Una función de dos variables'
  }
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
