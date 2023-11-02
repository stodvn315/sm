import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '../models/all.entity';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async getAll(): Promise<User[]> {
    return await this.em.find(User, {});
  }

  async getOne(id: string): Promise<User> {
    return await this.em.findOne(User, id, {
      populate: ['posts', 'subscriptions'],
    });
  }

  async getUserByName(username: string): Promise<User> {
    const user = await this.em.findOne(User, { username: username });
    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const { username, password } = userDto;
    const user = new User(username, password);
    await this.em.persistAndFlush(user);
    return user;
  }

  async deleteUser(id: string): Promise<User> {
    const userRef = await this.em.getReference(User, id);
    if (userRef) {
      await this.em.removeAndFlush(userRef);
      return userRef;
    }
  }
}
