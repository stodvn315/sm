import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '../models/all.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createUser(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }
}
