import { IsNotEmpty, IsString } from "class-validator";

export class createBadgeDto {

  @IsNotEmpty({ message: 'Badge name is required' })
  @IsString({ message: 'Badge name must be a valid string' })
  name: string;

  @IsNotEmpty({ message: 'Image is required' })
  @IsString({ message: 'Image name must be a valid string' })
  image: string;

}