import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // User Signup
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  // User Login
  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);

    // Ensure frontend receives a proper JWT string + user info
    return {
      token: result.token,
      role: result.role,
      userId: result.userId,
      name: result.name,
      email: result.email,
    };
  }
}
