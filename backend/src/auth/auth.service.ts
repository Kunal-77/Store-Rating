import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Signup and return token + user info
  async signup(data: SignupDto) {
    const existing = await this.usersRepo.findOne({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const validRoles = ['USER', 'ADMIN', 'OWNER'];
    const role = data.role && validRoles.includes(data.role) ? data.role : 'USER';

    const user = this.usersRepo.create({
      name: data.name,
      email: data.email,
      password: hashed,
      address: data.address,
      role,
    });

    const saved = await this.usersRepo.save(user);

    // Generate JWT for new user
    const payload = { id: saved.id, role: saved.role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      role: saved.role,
      userId: saved.id,
      name: saved.name,
      email: saved.email,
    };
  }

  // Login and return token + user info
  async login(data: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: data.email } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Generate JWT
    const payload = { id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      role: user.role,
      userId: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
