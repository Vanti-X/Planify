import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Token } from '../token/token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userName: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @OneToMany(() => Token, (Token) => Token.user)
  refreshTokens: Token[];
}
