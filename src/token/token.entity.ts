import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  refreshToken: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: User;

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
