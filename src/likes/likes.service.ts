import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { Userpost } from '../posts/userpost.entity';
import { User } from '../users/user.entity';
import { Like } from './like.entity';

@Injectable()
export class LikesService {
  constructor(private readonly em: EntityManager) {}

  async getPostLikes(postUuid: string): Promise<Like[]> {
    return await this.em.find(Like, { post: postUuid });
  }

  async createLike(postUuid: string, currUserUuid: string): Promise<Like> {
    const existingLike = await this.em.findOne(Like, {
      post: postUuid,
      owner: currUserUuid,
    });
    if (existingLike) {
      throw new BadRequestException('Already liked');
    }
    const like = new Like();
    const owner = await this.em.getReference(User, currUserUuid);
    const post = await this.em.getReference(Userpost, postUuid);
    if (owner && post) {
      like.setOwner(owner);
      like.setPost(post);
      await this.em.persistAndFlush(like);
      return like;
    }
  }

  async deleteLike(postUuid: string, currUserUuid: string): Promise<Like> {
    const existingLike = await this.em.findOne(Like, {
      post: postUuid,
      owner: currUserUuid,
    });
    if (existingLike) {
      await this.em.removeAndFlush(existingLike);
      return existingLike;
    }
    throw new BadRequestException('Like not found');
  }
}
