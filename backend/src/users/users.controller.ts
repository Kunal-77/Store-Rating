import { Controller, Get, Param, Put, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get all users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Get user by ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  // Update user password
  @Put(':id/password')
  updatePassword(@Param('id') id: number, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updatePassword(Number(id), dto.password);
  }

  // Admin create user
  @Post()
  async create(@Body() body: any) {
    return this.usersService.create(body);
  }
}
