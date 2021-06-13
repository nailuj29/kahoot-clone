import { Injectable } from '@nestjs/common';
import { Prisma, Quiz } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) { }

  async quiz(where: Prisma.QuizWhereUniqueInput): Promise<Quiz | null> {
    return this.prisma.quiz.findUnique({
      where,
      include: {
        questions: {
          select: {
            answers: true,
            correctAnswers: true,
            text: true,
          }
        }
      }
    });
  }

  async quizzes(params: {
    skip?: number,
    take?: number,
    cursor?: Prisma.QuizWhereUniqueInput,
    where?: Prisma.QuizWhereInput,
    orderBy?: Prisma.QuizOrderByInput
  }): Promise<Quiz[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.quiz.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    });
  }

  async createQuiz(data: Prisma.QuizCreateInput, questions: Prisma.QuestionCreateInput[]): Promise<Quiz> {
    const quiz = await this.prisma.quiz.create({
      data
    });

    for (const question of questions) {
      question.quiz = {
        connect: {
          id: quiz.id
        }
      };
      await this.prisma.question.create({
        data: question
      });
    }

    return this.prisma.quiz.findUnique({
      where: {
        id: quiz.id
      }
    });
  }
}
