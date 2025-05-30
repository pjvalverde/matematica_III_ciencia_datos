import { useParams, Link } from 'react-router-dom';

const LessonPage = () => {
  const { weekId, lessonId } = useParams();

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
        <LessonQuiz />

function LessonQuiz() {
  const questions = [
    {
      question: '¿Cuál es el resultado de 2 + 2?',
      options: ['3', '4', '5', '6'],
      correct: '4',
    },
    {
      question: '¿Cuál es la derivada de x^2?',
      options: ['x', '2x', 'x^2', '2'],
      correct: '2x',
    },
    {
      question: '¿Qué es un vector?',
      options: [
        'Un número real',
        'Una función',
        'Una magnitud con dirección',
        'Una constante',
      ],
      correct: 'Una magnitud con dirección',
    },
    {
      question: '¿Cuál es el dominio de f(x) = 1/x?',
      options: [
        'x ≠ 0',
        'x > 0',
        'x < 0',
        'x = 0',
      ],
      correct: 'x ≠ 0',
    },
    {
      question: '¿Qué representa la notación f(x, y)?',
      options: [
        'Una función de una variable',
        'Una función de dos variables',
        'Una constante',
        'Un número primo',
      ],
      correct: 'Una función de dos variables',
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
        onClick={() => alert('¡Lección marcada como completada!')}
      >
        {completed ? 'Marcar como completada' : 'Responde correctamente al menos 4 de 5'}
      </button>
      {showFeedback && !completed && (
        <div className="mt-4 text-red-600 font-semibold">Debes responder correctamente al menos 4 de 5 preguntas para completar la lección.</div>
      )}
    </div>
  );
}

      </div>
    </div>
  );
};

export default LessonPage;