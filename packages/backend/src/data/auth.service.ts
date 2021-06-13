import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(private users: UserService) { }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  async createUser({ email, username, password }: {
    email: string,
    username: string,
    password: string
  }): Promise<User> {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    return this.users.createUser({
      email,
      username,
      hashedPassword
    })
  }

  createToken(id: string): string {
    return sign({ id }, process.env["JWT_SECRET"]);
  }

  getToken(token: string): Record<string, unknown> {
    if (!token) {
      throw "Missing token";
    }
    let decodedToken = null;
    verify(token, process.env["JWT_SECRET"], (err, decoded) => {
      if (err) {
        throw err;
      }
      decodedToken = decoded;
    });

    return decodedToken; // unreachable
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const { id } = this.getToken(token);
      const users = await this.users.users({
        where: {
          id: {
            equals: id as string
          }
        }
      });
      if (users.length == 0) {
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

}
