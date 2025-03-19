import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Token } from './token.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async generateTokens(user: User): Promise<{ access_token: string }> {
    const payload = { id: user.id, email: user.email, userName: user.userName };

    const [access_token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_ACCESS_TOKEN'),
      }),
      await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_REFRESH_TOKEN'),
      }),
    ]);

    await this.saveRefreshToken(refreshToken, user);

    return { access_token };
  }

  async saveRefreshToken(refreshToken: string, user: User) {
    await this.tokenRepository.save({
      refreshToken,
      user,
      expiresAt: new Date(
        Date.now() + +this.configService.get('JWT_EXPIRES_REFRESH_TOKEN_MS'),
      ),
    });
  }

  async updateRefreshToken(user: User) {
    const token = await this.getRefreshToken(user.id);
    const payload = { id: user.id, email: user.email, userName: user.userName };

    if (token && !token.isExpired()) {
      return await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_ACCESS_TOKEN'),
      });
    }

    return await this.generateTokens(user);
  }

  private async getRefreshToken(userId: number): Promise<Token | null> {
    return await this.tokenRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
