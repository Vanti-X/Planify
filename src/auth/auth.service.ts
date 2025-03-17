import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { User } from '../user/user.entity';
import { AuthDto } from './auth.dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new NotFoundException('User with this email is not registered');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    return {
      access_token: await this.jwtService.signAsync({
        sub: user.id,
        userName: user.userName,
        userEmail: user.email,
      }),
    };
  }

  async signUp({ email, confirmPassword, password, userName }: AuthDto) {
    const candidate = await this.usersRepository.findOneBy({
      email,
    });

    if (candidate) {
      throw new ConflictException('User already exists');
    }

    if (confirmPassword !== password) {
      throw new BadRequestException('Passwords do not match');
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    return this.usersRepository.save({
      email,
      password: hashPassword,
      userName,
    });
  }
}
