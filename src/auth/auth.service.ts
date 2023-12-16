import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { ChangePassDto } from './dto/change-pass.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: LoginDto) {
    const user = await this.validateUser(userDto);
    return this.genToken(user);
  }

  async reg(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByName(userDto.username);
    if (candidate) {
      throw new BadRequestException('User with this username already exists');
    }
    const hashPass = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPass,
    });
    return this.genToken(user);
  }

  async updatePass(userDto: ChangePassDto) {
    const validUser = await this.validateUser({
      username: userDto.username,
      password: userDto.oldPassword,
    });
    if (validUser) {
      const hashPass = await bcrypt.hash(userDto.password, 5);
      return await this.userService.updateUser(validUser.getUuid(), {
        password: hashPass,
        isChangePass: true,
      });
    }
  }

  private async genToken(user: User) {
    const payload = { username: user.username, id: user.uuid };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: LoginDto) {
    const user: User = await this.userService.getUserByName(userDto.username);
    if (user) {
      const passEquals = await bcrypt.compare(
        userDto.password,
        user.getPassword(),
      );
      if (passEquals) {
        return user;
      }
      throw new UnauthorizedException('Incorrect password');
    }
    throw new UnauthorizedException('Incorrect username');
  }
}
