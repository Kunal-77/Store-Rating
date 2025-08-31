import { IsEmail, IsNotEmpty, Length, Matches, IsOptional, IsIn } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @Length(20, 60)
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one uppercase letter and one special character',
  })
  password: string;

  @IsNotEmpty()
  @Length(1, 400)
  address: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN', 'OWNER'])
  role?: string; 
}

