import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Subscription } from '../subscriptions/subscription.entity';
import { User } from '../users/user.entity';
import { Userpost } from './userpost.entity';
import { CreatePostDto } from './dto/createPost.dto';

@Injectable()
export class PostsService {
  constructor(private readonly em: EntityManager) {}

  async getAll(): Promise<Userpost[]> {
    return await this.em.find(Userpost, {});
  }

  async getFeed(currUserUuid: string): Promise<Userpost[]> {
    const subscriptions = await this.em.find(Subscription, {
      subscriber: currUserUuid,
    });
    if (subscriptions.length) {
      const subscriptionsUuids = subscriptions.map((s) =>
        s.getSubscriptionTarget().getUuid(),
      );
      return await this.em.find(Userpost, { owner: subscriptionsUuids });
    }
    return [];
  }

  async getById(uuid: string): Promise<Userpost> {
    return await this.em.findOne(Userpost, uuid, {
      populate: ['likes', 'comments'],
    });
  }

  async getUserPosts(userUuid: string): Promise<Userpost[]> {
    return await this.em.find(Userpost, { owner: userUuid });
  }

  async getPostPhoto(uuid: string): Promise<string> {
    return (await this.getById(uuid)).getImage();
  }

  async createPost(
    postDto: CreatePostDto,
    ownerUuid: string,
    image?: string,
  ): Promise<Userpost> {
    const post = new Userpost(postDto.content);
    if (image) {
      post.setImage(image);
    }
    const owner = await this.em.getReference(User, ownerUuid);
    post.setOwner(owner);
    await this.em.persistAndFlush(post);
    return post;
  }

  async updatePost(
    postDto: CreatePostDto,
    currUserUuid: string,
    postUuid: string,
    image?: string,
  ): Promise<Userpost> {
    const post = await this.em.findOne(Userpost, postUuid);
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    console.log(post);
    if (post.getOwner().getUuid() === currUserUuid) {
      post.setContent(postDto.content);
      image ? post.setImage(image) : post.setImage(null);
      await this.em.persistAndFlush(post);
      return post;
    }
    throw new UnauthorizedException("Post doesn't belong to this user");
  }

  async deletePost(postId: string, currUserUuid: string): Promise<Userpost> {
    const post = await this.em.findOne(Userpost, postId);
    if (post.getOwner().getUuid() === currUserUuid) {
      await this.em.removeAndFlush(post);
      return post;
    }
    throw new UnauthorizedException("Post doesn't belong to this user");
  }
}
