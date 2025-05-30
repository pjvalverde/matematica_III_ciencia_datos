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
        <p>El contenido detallado de esta lección se está desarrollando.</p>
      </div>
    </div>
  );
};

export default LessonPage; 