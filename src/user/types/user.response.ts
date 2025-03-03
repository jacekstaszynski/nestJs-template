import { IsDate, IsEmail, IsString, IsUUID } from 'class-validator';

export class UserResponse {
  @IsUUID()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
