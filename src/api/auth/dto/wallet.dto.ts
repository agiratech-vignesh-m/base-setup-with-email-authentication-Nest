import { IsString, IsOptional, IsNotEmpty, ValidateIf } from 'class-validator';
import { IsEitherUserOrAdminId } from './validate.dto';

export class UserRegisterDto {
  @IsNotEmpty({ message: 'ORG is required' })
  org: string;

  @IsOptional()
  @IsEitherUserOrAdminId()
  @IsString({ message: 'User ID should be a string' })
  user_Id?: string;

  @IsOptional()
  @IsEitherUserOrAdminId()
  @IsString({ message: 'Admin ID should be a string' })
  admin_Id?: string;
}
