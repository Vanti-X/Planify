import { Body, Post, Controller } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signIn')
  async signIn(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return await this.authService.signIn(email, password);
  }

  @Post('signUp')
  async signUp(@Body() candidate: AuthDto) {
    return this.authService.signUp(candidate);
  }

  @Post('updateToken')
  async updateToken(@Body() { userId }: { userId: string }) {
    return this.authService.updateToken(+userId);
  }
}
