import { IsNotEmpty, IsString, IsEmail, MinLength, Matches, MaxLength, IsOptional } from 'class-validator';

export class CreateProfileDto {

  @IsNotEmpty({ message: 'first_name is required' })
  @IsString({ message: 'first_name must be a valid string' })
  first_name: string;

  @IsOptional()
  @IsNotEmpty({ message: 'last_name is required' })
  @IsString({ message: 'last_name must be a valid string' })
  last_name: string;

  @IsNotEmpty({ message: 'Age is required' })
  @IsString({ message: 'Age must be a valid string' })
  age: string;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsString({ message: 'Gender must be a valid string' })
  gender: string;

  @IsOptional()
  @IsString()
  profile_pic: string;
}
