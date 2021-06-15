import Link from 'next/link'
import React, { FunctionComponent, ReactElement } from 'react'
import { useQuery } from 'react-query';
import { Quiz } from '../types/quiz';
import config from "../config";
import QuizPreview from './QuizPreview';
import ErrorModal from './ErrorModal';

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
      <ErrorModal>
        An error occurred fetching the quizzes
      </ErrorModal>
    );
  }

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      {data.map(quiz =>
        (
          <Link href={`/quiz/${quiz.id}`}>
            <span className="cursor-pointer">
              <QuizPreview key={quiz.id} quiz={quiz} />
            </span>
          </Link>
        )
      )}
    </div>
  )
}

export default QuizList;
