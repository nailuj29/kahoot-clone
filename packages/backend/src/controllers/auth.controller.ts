import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) { }

  @Post("/signup")
  async signup(
    @Body("username") username: string,
    @Body("email") email: string,
    @Body("password") password: string
  ): Promise<{ token: string }> {
    console.table({ username, email, password });
    const user = await this.auth.createUser({ username, email, password });

    const token = this.auth.createToken(user.id);

    return { token };
  }


}
