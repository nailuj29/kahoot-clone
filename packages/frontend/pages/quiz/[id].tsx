import { Quiz } from '../../types/quiz'
import React, { FunctionComponent } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/dist/client/router'
import config from '../../config'
import ErrorModal from '../../components/ErrorModal'

const fetchQuiz =  async ({ queryKey }): Promise<Quiz> => {
  const [ _key, id ] = queryKey;
  const res = await fetch(`${config.apiRoot}/quizzes/${id}`)
  if (res.status === 404) {
    throw new Error("Not found");
  }
  return await res.json() as Quiz
}

const ViewQuiz: FunctionComponent = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isError, isLoading, error } = useQuery<Quiz, Error>(["singleQuiz", id], fetchQuiz)

  if (isError) {
    if (error.message === "Not found") {
      router.push("/404");
    }
    return (
      <ErrorModal>
        An error occurred finding your quiz
      </ErrorModal>
    )
  }

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  return <div>Loaded</div>
}

export default ViewQuiz;
