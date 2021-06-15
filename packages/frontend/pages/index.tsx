import React from 'react';
import QuizList from '../components/QuizList';

export function Index() {
  return (
    <div>
      <h1 className="text-center text-4xl font-semibold border-b-2 border-gray-300 pb-1">
        Welcome to  [INSERT NAME HERE]
      </h1>
      <QuizList count={25}/>
    </div>
  );
}

export default Index;
