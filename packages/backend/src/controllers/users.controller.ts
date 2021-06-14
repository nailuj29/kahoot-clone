/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../services/user.service';
import { Request } from "express";

@Controller('users')
export class UsersController {
  constructor(private users: UserService) { }

  @Get("/:id")
  async byId(@Param("id") id: string): Promise<Partial<User>> {
    const { hashedPassword: _, ...user }  = await this.users.user({
      id
    })
    return user;
  }

  @Get("/me")
  @UseGuards(AuthGuard)
  async me(@Req() req: Request): Promise<Partial<User>> {
    const { hashedPassword: _, ...user }  = await this.users.user({
      id: req.id,
    })
    return user;
  }
}
