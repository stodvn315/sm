import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/reg')
  reg(@Body() userDto: CreateUserDto) {
    return this.authService.reg(userDto);
  }
}
