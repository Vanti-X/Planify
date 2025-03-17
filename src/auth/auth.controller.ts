import {
  Body,
  Post,
  Controller,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signIn')
  async signIn(
    @Body() { email, password }: Omit<AuthDto, 'userName' | 'confirmPassword'>,
  ) {
    try {
      return await this.authService.signIn(email, password);
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new InternalServerErrorException('Internal server error!');
    }
  }

  @Post('signUp')
  async signUp(@Body() candidate: AuthDto) {
    try {
      return await this.authService.signUp(candidate);
    } catch (err) {
      if (
        err instanceof ConflictException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      throw new InternalServerErrorException('Internal server error!');
    }
  }
}
