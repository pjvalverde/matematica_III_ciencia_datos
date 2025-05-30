import React from 'react';
import { useParams, Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

const LessonPage = () => {
  const { weekId, lessonId } = useParams();
  const navigate = useNavigate();

  // Función para marcar como completada y regresar al módulo
  function handleLessonComplete() {
    // Opcional: podrías guardar el progreso en Firebase aquí si lo deseas
    navigate(`/modulo/${weekId}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/semana/${weekId}`} className="text-primary-600 hover:underline">
          &larr; Volver a Semana {weekId}
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Lección {lessonId}</h1>
      <p className="text-gray-600 mb-8">Contenido de la lección {lessonId} de la semana {weekId}</p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quiz de comprensión</h2>
        <LessonQuiz onComplete={handleLessonComplete} />
      </div>
    </div>
  );
};

function LessonQuiz({ onComplete }: { onComplete: () => void }) {
  // Preguntas de dificultad intermedia/alta
  const questions = [
    {
      question: 'Sea f(x, y) = x²y + y³. ¿Cuál es la derivada parcial ∂f/∂x?',
      options: [
        '2xy',
        '2xy + y³',
        '2xy + y',
        'y³',
      ],
      correct: '2xy',
    },
    {
      question: '¿Cuál es el valor del determinante Jacobiano de la transformación polar (x = r cosθ, y = r sinθ)?',
      options: [
        'r',
        '1',
        'r²',
        'cosθ',
      ],
      correct: 'r',
    },
    {
      question: '¿En qué punto (x, y) la función f(x, y) = x² + y² alcanza su mínimo global?',
      options: [
        '(1,1)',
        '(0,0)',
        '(2,2)',
        '(x,y) tal que x=y',
      ],
      correct: '(0,0)',
    },
    {
      question: 'Sea F(x, y) = (x²y, xy²). ¿Cuál es el divergente de F?',
      options: [
        '2xy + 2y',
        '2x + 2y',
        '2xy',
        'x² + y²',
      ],
      correct: '2x + 2y',
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

  const [answers, setAnswers] = React.useState<(string | null)[]>(Array(5).fill(null));
  const [showFeedback, setShowFeedback] = React.useState(false);
  const correctCount = answers.filter((a, i) => a === questions[i].correct).length;
  const completed = correctCount >= 4 && answers.every(a => a !== null);

  function handleAnswer(qIdx: number, option: string) {
    const newAns = [...answers];
    newAns[qIdx] = option;
    setAnswers(newAns);
    setShowFeedback(true);
  }

  function handleComplete() {
    if (completed && onComplete) onComplete();
  }

  return (
    <div>
      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="mb-2 font-medium">{i + 1}. {q.question}</p>
          <div className="flex flex-wrap gap-2 mb-1">
            {q.options.map((o, j) => (
              <button
                key={j}
                className={`px-3 py-1 rounded border ${answers[i] === o ? (o === q.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-gray-100 hover:bg-blue-100'}`}
                disabled={answers[i] !== null}
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
        className={`mt-4 px-4 py-2 rounded font-bold ${completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        disabled={!completed}
        onClick={handleComplete}
      >
        {completed ? 'Marcar como completada' : 'Responde correctamente al menos 4 de 5'}
      </button>
      {showFeedback && !completed && (
        <div className="mt-4 text-red-600 font-semibold">Debes responder correctamente al menos 4 de 5 preguntas para completar la lección.</div>
      )}
    </div>
  );
}

export default LessonPage;