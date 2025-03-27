import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../user/user.entity';
import { AuthDto } from './auth.dto/auth.dto';
import { TokenService } from '../token/token.service';
import {
  QBadRequestException,
  QConflictException,
} from '../exceptions/all-exceptions.filter';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.checkUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User with this email is not registered');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new QBadRequestException(
        'Passwords do not match',
        'PASSWORD_MISMATCH',
        {
          password: 'Incorrect password',
        },
      );
    }
    const { access_token } = await this.tokenService.generateTokens(user);

    return {
      access_token,
    };
  }

  async signUp({ email, confirmPassword, password, userName }: AuthDto) {
    const candidate = await this.checkUserByEmail(email);

    if (candidate) {
      throw new QConflictException('User already exists', 'USER_EXISTS', {
        email: 'Email is already in use',
      });
    }

    if (confirmPassword !== password) {
      throw new QBadRequestException(
        'Passwords do not match',
        'PASSWORD_MISMATCH',
        {
          password: 'Passwords do not match',
          confirmPassword: 'Passwords do not match',
        },
      );
    }

    const hashPassword = await this.hashPassword(password);

    const newUser = await this.usersRepository.save({
      email,
      password: hashPassword,
      userName,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }

  async updateToken(userId: number) {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.tokenService.updateRefreshToken(user);
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  private async checkUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({
      email,
    });
  }
}
