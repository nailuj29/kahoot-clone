import React, { FunctionComponent, ReactElement } from 'react'
import { useQuery } from 'react-query';
import { Quiz } from '../types/quiz';
import config from "../config";
import QuizPreview from './QuizPreview';

const fetchQuizzes = async ({ queryKey }): Promise<Quiz[]> => {
  const [ _key, count ] = queryKey;
  const res = await fetch(`${config.apiRoot}/quizzes?limit=${count}`);

  return await res.json() as Quiz[];
}

interface QuizListProps {
  count: number;
}

const QuizList: FunctionComponent<QuizListProps> = ({ count }) => {
  const { data, isError, isLoading } = useQuery<Quiz[], Error>(["quizzes", count], fetchQuizzes);

  if (isError) {
    return (
      <div className="text-red-600 font-bold">
        An error occurred fetching the latest quizzes
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      {data.map(quiz => <QuizPreview key={quiz.id} quiz={quiz} />)}
    </div>
  )
}

export default QuizList;
