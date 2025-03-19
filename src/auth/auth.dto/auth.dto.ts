import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  userName: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  password: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  confirmPassword: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
