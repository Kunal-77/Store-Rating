import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  // Create user (used by signup + AdminDashboard)
  async create(data: Partial<User>) {
    if (!data.email) throw new BadRequestException('Email is required');
    if (!data.password) throw new BadRequestException('Password is required');

    // Check if email already exists
    const existing = await this.findByEmail(data.email);
    if (existing) throw new BadRequestException('Email already exists');

    // Hash password
    const hashed = await bcrypt.hash(data.password, 10);

    const user = this.repo.create({
      ...data,
      email: data.email,
      password: hashed,
      role: data.role || 'USER', // default role = USER
    });

    return this.repo.save(user);
  }

  // Update password method
  async updatePassword(id: number, newPassword: string) {
    if (!newPassword) throw new BadRequestException('Password is required');
    if (newPassword.length < 8 || newPassword.length > 16) {
      throw new BadRequestException('Password must be 8–16 characters long');
    }
    if (!/[A-Z]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter and one special character',
      );
    }

    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);

    return this.repo.save(user);
  }
}
