import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/models/all.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.genToken(user);
  }

  async reg(userDto: CreateUserDto) {
    console.log(userDto);
    const candidate = await this.userService.getUserByName(userDto.username);
    console.log(candidate);
    if (candidate) {
      throw new HttpException(
        'User with this username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPass = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPass,
    });
    return this.genToken(user);
  }

  private async genToken(user: User) {
    const payload = { username: user.username, id: user.uuid };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByName(userDto.username);
    if (user) {
      const passEquals = await bcrypt.compare(userDto.password, user.password);
      if (passEquals) {
        return user;
      }
      throw new UnauthorizedException({ message: 'Incorrect password' });
    }
    throw new UnauthorizedException({ message: 'Incorrect username' });
  }
}
