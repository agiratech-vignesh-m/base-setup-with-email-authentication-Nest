import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  Matches,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { IsEqualTo } from './password_validate.dto';

export enum ResendEnumType {
  FORGOT = "forgot",
  VERIFY = "verify",
}

export class verifyEmailDto {
  @IsNotEmpty({ message: "Token can't be empty" })
  @IsString({ message: 'Password must be a valid string' })
  token: string;
}

export class eOtpLoginDto {
  @IsNotEmpty({ message: "Email can't be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "OTP can't be empty" })
  @MaxLength(6, { message: "OTP must be six digits" })
  @MinLength(6, { message: "OTP must be six digits" })
  otp: string;
}