import { prisma } from '@kahoot-clone/database';
import { Prisma, Question, Quiz } from '@prisma/client';
import { Handler } from 'express';

export const quizzes_get: Handler = async (req, res) => {
  const { page: pageStr, limit: limitStr } = req.query as {
    [key: string]: string;
  };
  const page = Number(pageStr) - 1 || 0;
  const limit = Number(limitStr) || 50;
  if (page < 0) {
    res
      .status(400)
      .json({
        status: 400,
        message: 'page must be a positive number greater than 0',
      });
    return;
  }

  if (limit < 1) {
    res
      .status(400)
      .json({
        status: 400,
        message: 'limit must be a positive number greater than 1',
      });
    return;
  }
  const quizzes = await prisma.quiz.findMany({
    orderBy: {
      updatedAt: Prisma.SortOrder.desc,
    },
    where: {
      private: {
        equals: false,
      },
    },
    skip: page * limit,
    take: limit,
  });
  res.json(quizzes);
};

export const quizzes_post: Handler = async (req, res) => {
  const { title, questions, private: isPrivate = false } = req.body as {
    [key: string]: unknown;
  };
  let quiz: Quiz;
  if (typeof title == 'string' && typeof isPrivate == 'boolean') {
    try {
      quiz = await prisma.quiz.create({
        data: {
          userId: req.id,
          title,
          private: isPrivate,
        },
      });
    } catch (e) {
      res
        .status(500)
        .send({
          status: 500,
          message: 'An unknown error occurred while creating your quiz ',
        });
      return;
    }
  }
  const questionsList: Partial<Question>[] = questions as Partial<Question>[];

  for (const question of questionsList) {
    try {
      if (!(question.answers && question.correctAnswers && question.text)) {
        res
          .status(400)
          .json({
            status: 400,
            message:
              'You must provide a title, name, and answers for your question',
          });
        return;
      }
      await prisma.question.create({
        data: {
          text: question.text,
          answers: question.answers,
          correctAnswers: question.correctAnswers,
          quizId: quiz.id,
        },
      });
    } catch (e) {
      res
        .status(500)
        .send({
          status: 500,
          message: 'An unknown error occurred while creating your quiz ',
        });
      return;
    }
  }

  const finalQuiz = await prisma.quiz.findFirst({
    where: {
      id: quiz.id,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      questions: {
        select: {
          answers: true,
          correctAnswers: true,
          text: true,
        },
      },
    },
  });

  res.status(201).json(finalQuiz);
};

export const quiz_get: Handler = async (req, res) => {
  const id = req.params['id'];

  const quiz = await prisma.quiz.findFirst({
    where: {
      id: {
        equals: id,
      },
    },
    include: {
      questions: {
        select: {
          answers: true,
          correctAnswers: true,
          text: true,
        },
      },
    },
  });

  if (quiz.private) {
    if (!(req.authenticated && req.id == quiz.userId)) {
      res.status(403).json({ status: 403, message: 'Quiz is private' });
      return;
    }
  }

  if (quiz == null) {
    res.status(404).json({ status: 404, message: 'Quiz not found' });
  }
  res.json(quiz);
};
