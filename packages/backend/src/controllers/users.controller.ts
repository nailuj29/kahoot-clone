/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Quiz, User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../services/user.service';
import { Request } from "express";
import { QuizService } from '../services/quiz.service';

@Controller('users')
export class UsersController {
  constructor(private users: UserService, private quizzes: QuizService) { }

  @Get("/:id")
  async byId(@Param("id") id: string): Promise<Partial<User>> {
    const { hashedPassword: _, ...user }  = await this.users.user({
      id
    })
    return user;
  }

  @Get("/:id/quizzes")
  async byIdQuizzes(@Param("id") id: string): Promise<Quiz[]> {
    return this.quizzes.quizzes({
      where: {
        authorId: {
          equals: id
        },
        AND: {
          private: {
            equals: false
          }
        }
      },
    })
  }

  @Get("/me")
  @UseGuards(AuthGuard)
  async me(@Req() req: Request): Promise<Partial<User>> {
    const { hashedPassword: _, ...user }  = await this.users.user({
      id: req.id,
    })
    return user;
  }

  @Get("/me/quizzes")
  @UseGuards(AuthGuard)
  async myQuizzes(@Req() req: Request): Promise<Quiz[]> {
    return this.quizzes.quizzes({
      where: {
        authorId: {
          equals: req.id
        }
      }
    })
  }
}
