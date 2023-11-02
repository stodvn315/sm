import { EntityManager } from '@mikro-orm/core';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { User, Userpost } from 'src/models/all.entity';

@Injectable()
export class PostsService {
  constructor(private readonly em: EntityManager) {}

  async getAll(): Promise<Userpost[]> {
    return await this.em.find(Userpost, {});
  }

  async getById(id: string): Promise<Userpost> {
    return await this.em.findOne(Userpost, id, { populate: true });
  }

  async getUserPosts(id: string): Promise<Userpost[]> {
    return await this.em.find(Userpost, { owner: id });
  }

  async createPost(postDto: CreatePostDto, ownerId: string): Promise<Userpost> {
    const { content } = postDto;
    const post = new Userpost(content);
    const owner = this.em.getReference(User, ownerId);
    post.owner = owner.uuid;
    await this.em.persistAndFlush(post);
    return post;
  }

  async deletePost(postId: string, currUserId: string): Promise<Userpost> {
    const post = await this.em.findOne(Userpost, postId);
    if (String(post.owner) === currUserId) {
      await this.em.removeAndFlush(post);
      return post;
    }
    throw new UnauthorizedException({
      message: "Post doesn't belong to this user",
    });
  }
}
