import React, { useState } from 'react';
import { useProgressStore, ACTIVITY_POINTS } from '../store/progressStore';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ModuleQuizProps {
  weekId: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
  onComplete: () => void;
}

const ModuleQuiz = ({ weekId, moduleId, title, questions, onComplete }: ModuleQuizProps) => {
  const { completeQuiz } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter((q, index) => 
      q.correctAnswer === answers[index]
    ).length;
    
    // Calcular el puntaje proporcional al número de respuestas correctas
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * ACTIVITY_POINTS.quiz);
    return calculatedScore;
  };

  const handleSubmit = () => {
    // Verificar si todas las preguntas han sido respondidas
    const unanswered = answers.findIndex(a => a === -1);
    if (unanswered !== -1) {
      // Ir a la primera pregunta sin responder
      setCurrentQuestion(unanswered);
      alert('Por favor responde todas las preguntas antes de enviar.');
      return;
    }

    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    
    // Registrar el cuestionario como completado
    completeQuiz(Number(weekId), Number(moduleId), finalScore);
  };

  // Si ya se envió el cuestionario, mostrar resultados
  if (isSubmitted) {
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter((q, index) => 
      q.correctAnswer === answers[index]
    ).length;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{title} - Resultados</h2>
        
        <div className="text-center py-6">
          <div className="text-4xl font-bold mb-2">
            {score}/{ACTIVITY_POINTS.quiz}
          </div>
          <p className="text-gray-600 mb-4">
            Respondiste correctamente {correctAnswers} de {totalQuestions} preguntas
          </p>
          
          <div className={`text-lg font-medium mb-6 ${
            score >= ACTIVITY_POINTS.quiz/2 ? 'text-green-600' : 'text-red-600'
          }`}>
            {score >= ACTIVITY_POINTS.quiz/2 
              ? '¡Buen trabajo!' 
              : 'Necesitas mejorar. Repasa el contenido del módulo.'}
          </div>
          
          <button
            onClick={onComplete}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Volver al módulo
          </button>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h3 className="font-medium mb-4">Revisión de respuestas:</h3>
          {questions.map((q, index) => (
            <div key={q.id} className="mb-4 pb-4 border-b last:border-b-0">
              <p className="font-medium mb-2">{index + 1}. {q.question}</p>
              <div className="grid gap-2">
                {q.options.map((option, optIndex) => (
                  <div 
                    key={optIndex}
                    className={`p-2 rounded ${
                      answers[index] === optIndex && q.correctAnswer === optIndex
                        ? 'bg-green-100 border border-green-300'
                        : answers[index] === optIndex && q.correctAnswer !== optIndex
                        ? 'bg-red-100 border border-red-300'
                        : q.correctAnswer === optIndex
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {option}
                    {answers[index] === optIndex && q.correctAnswer === optIndex && 
                      <span className="ml-2 text-green-600">✓ Tu respuesta (correcta)</span>}
                    {answers[index] === optIndex && q.correctAnswer !== optIndex && 
                      <span className="ml-2 text-red-600">✗ Tu respuesta (incorrecta)</span>}
                    {answers[index] !== optIndex && q.correctAnswer === optIndex && 
                      <span className="ml-2 text-green-600">✓ Respuesta correcta</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Pregunta {currentQuestion + 1} de {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {ACTIVITY_POINTS.quiz} puntos posibles
          </span>
        </div>
        
        {/* Progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${(answers.filter(a => a !== -1).length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Pregunta actual */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">
          {currentQuestion + 1}. {questions[currentQuestion].question}
        </h3>
        
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                answers[currentQuestion] === index ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3 ${
                  answers[currentQuestion] === index ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}>
                  {answers[currentQuestion] === index && 
                    <span className="text-white text-xs">✓</span>
                  }
                </div>
                <span>{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navegación */}
      <div className="flex justify-between">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestion === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Anterior
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={goToNextQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Enviar respuestas
          </button>
        )}
      </div>
    </div>
  );
};

export default ModuleQuiz; 