import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from '../auth/auth.middleware';
import { AuthController } from '../controllers/auth.controller';
import { QuizzesController } from '../controllers/quizzes.controller';
import { UsersController } from '../controllers/users.controller';
import { AuthService } from '../services/auth.service';
import { PrismaService } from '../services/prisma.service';
import { QuizService } from '../services/quiz.service';
import { UserService } from '../services/user.service';


@Module({
  imports: [],
  controllers: [AuthController, UsersController, QuizzesController],
  providers: [AuthService, PrismaService, QuizService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
