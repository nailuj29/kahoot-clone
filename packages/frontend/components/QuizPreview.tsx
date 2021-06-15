import React, { FunctionComponent } from 'react'
import { Quiz } from '../types/quiz';

interface QuizPreviewProps {
  quiz: Quiz;
}

const QuizPreview: FunctionComponent<QuizPreviewProps> = ({ quiz }) => {
  return (
    <div>
      <h2>{ quiz.title }</h2>
      <p>{ quiz.questions.length } questions</p>
    </div>
  )
}

export default QuizPreview;
