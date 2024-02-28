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

export class signUpDto {
 
  @IsNotEmpty({ message: 'email is required' })
  @IsString({ message: 'email must be a valid string' })
  email: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Country code is required' })
  @IsString({ message: 'Country code must be a valid string' })
  country_code: string;

  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsString({ message: 'Mobile number must be a valid string' })
  mobile_number: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a valid string' })
  @MinLength(8)
  @MaxLength(16)
  @Matches(
    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,16}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

}

export class verifyOtpDto {
  @IsNotEmpty({ message: "Email can't be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "OTP can't be empty" })
  @MaxLength(6, { message: "OTP must be six digits" })
  @MinLength(6, { message: "OTP must be six digits" })
  otp: string;
}

export class resendOtpDto {
  @IsNotEmpty({ message: "Email can't be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;
}

export class loginDto {
  @IsNotEmpty({ message: "Email Id can't be empty" })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: "Password can't be empty" })
  @MinLength(8, { message: 'Mininum 8 characters required' })
  password: string;
}

export class passwordDto {

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a valid string' })
  @MinLength(8)
  @MaxLength(16)
  @Matches(
    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,16}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsString()
  @MinLength(8, {
    message: 'Confirm password must be longer than or equal to 8 characters',
  })
  @MaxLength(16, {
    message: "Confirm password dosen't exceed 16 charecters",
  })
  @IsEqualTo('password', {
    message: 'Password and confirm password must be equal',
  })
  confirmPassword: string;
}

export class OtpVerificationDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Country code must be a string' })
  country_code: string;

  @IsOptional()
  mobile_number: string;

  @IsNotEmpty()
  @IsString({ message: "OTP can't be empty" })
  otp: string;

  @IsNotEmpty({ message: 'Resend type is required' })
  @IsString()
  @IsEnum(ResendEnumType)
  resend_type: ResendEnumType;
}
