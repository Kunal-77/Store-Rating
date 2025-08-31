// src/users/dto/update-password.dto.ts
import { IsString, Length, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @Length(8, 16, { message: 'Password must be 8–16 characters long' })
  @Matches(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
  @Matches(/[!@#$%^&*]/, { message: 'Must contain at least one special character' })
  password: string;
}
