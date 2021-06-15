import { Body, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseArrayPipe, ParseBoolPipe, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Prisma, Quiz } from "@prisma/client";
import { Type } from "class-transformer";
import { Request } from "express";
import { AuthGuard } from "../auth/auth.guard";
import { QuizService } from "../services/quiz.service";

@Controller("quizzes")
export class QuizzesController {
  constructor(private quizzes: QuizService) { }

  @Get("/")
  async all(
    @Req() req: Request,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit: number
  ): Promise<Quiz[]> {
    return this.quizzes.quizzes({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "asc"
      },
      where: {
        private: {
          equals: false
        }
      },
    });
  }

  @Get("/:id")
  async byId(
    @Param("id") id: string
  ): Promise<Quiz> {
    const quiz = await this.quizzes.quiz({
      id
    });
    if (quiz == null) {
      throw new NotFoundException()
    }
    return quiz;
  }

  @Post("/")
  @UseGuards(AuthGuard)
  async newQuiz(
    @Req() req: Request,
    @Body("title") title: string,
    @Body("private", new DefaultValuePipe(false), ParseBoolPipe) isPrivate: boolean,
    @Body("questions", ParseArrayPipe) questions: QuestionInBody[]
  ): Promise<Quiz> {
    const questionCreates: Prisma.QuestionCreateInput[] = [];
    for (const question of questions) {
      questionCreates.push({
        text: question.text,
        answers: question.answers,
        correctAnswers: question.correctAnswers
      });
    }
    const quiz = await this.quizzes.createQuiz({
      author: {
        connect: {
          id: req.id
        }
      },
      title,
      private: isPrivate,
    }, questionCreates);

    return quiz;
  }
}

class QuestionInBody {
  text: string;

  @Type(() => String)
  answers: string[];

  @Type(() => Number)
  correctAnswers: number[];
}
