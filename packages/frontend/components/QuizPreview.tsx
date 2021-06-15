import React, { FunctionComponent } from 'react'
import { Quiz } from '../types/quiz';

interface QuizPreviewProps {
  quiz: Quiz;
}

const QuizPreview: FunctionComponent<QuizPreviewProps> = ({ quiz }) => {
  return (
    <div className="bg-gray-300 border-gray-400 border-2 rounded mt-3 mx-2 pl-1">
      <h2 className="text-xl font-semibold">{ quiz.title }</h2>
      <p className="font-light pl-1">{ quiz.questions.length } questions</p>
    </div>
  )
}

export default QuizPreview;
