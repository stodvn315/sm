import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async getAll(): Promise<User[]> {
    return await this.em.find(User, {});
  }

  async getOne(uuid: string): Promise<User> {
    return await this.em.findOne(User, uuid, {
      populate: ['posts', 'subscriptions'],
    });
  }

  async getUserByName(username: string): Promise<User> {
    const user = await this.em.findOne(User, { username: username });
    return user;
  }

  async getUserPhoto(uuid: string): Promise<string> {
    const user = await this.em.findOne(User, uuid);
    return user.getImage();
  }

  async createUser(userDto: CreateUserDto, image?: string): Promise<User> {
    const { username, password, bio } = userDto;
    const user = new User(username, password);
    bio ? user.setBio(bio) : user.setBio('');
    if (image) {
      user.setImage(image);
    }
    await this.em.persistAndFlush(user);
    return user;
  }

  async updateUser(
    uuid: string,
    userDto: UpdateUserDto,
    image?: string,
  ): Promise<User> {
    const user = await this.em.findOne(User, uuid);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (
      (await this.getUserByName(userDto.username)) &&
      userDto.username != user.getUsername()
    ) {
      throw new BadRequestException('Username belongs to another user');
    }
    if (userDto.username) {
      user.setUsername(userDto.username);
    }
    if (userDto.isChangePass) {
      user.setPassword(userDto.password);
    }
    if (userDto.bio) {
      user.setBio(userDto.bio);
    }
    if (image) {
      user.setImage(image);
    }
    await this.em.persistAndFlush(user);
    return user;
  }

  async deleteUser(uuid: string): Promise<User> {
    const userRef = await this.em.getReference(User, uuid);
    if (!userRef) {
      throw new BadRequestException('User not found');
    }
    await this.em.removeAndFlush(userRef);
    return userRef;
  }
}
