import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePassDto } from './dto/change-pass.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  login(@Body() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @Public()
  @Post('/reg')
  reg(@Body() userDto: CreateUserDto) {
    return this.authService.reg(userDto);
  }

  @Post('/update-pass')
  updatePass(@Body() userDto: ChangePassDto) {
    return this.authService.updatePass(userDto);
  }
}
