import { EntityManager } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Like, User, Userpost } from 'src/models/all.entity';

@Injectable()
export class LikesService {
  constructor(private readonly em: EntityManager) {}

  async createLike(postId: string, currUserId: string): Promise<Like> {
    const existingLike = await this.em.findOne(Like, {
      post: postId,
      owner: currUserId,
    });
    if (existingLike) {
      throw new HttpException('Already liked', HttpStatus.BAD_REQUEST);
    }
    const like = new Like();
    like.owner = (await this.em.getReference(User, currUserId)).uuid;
    like.post = (await this.em.getReference(Userpost, postId)).uuid;
    await this.em.persistAndFlush(like);
    return like;
  }

  async deleteLike(postId: string, currUserId: string): Promise<Like> {
    const existingLike = await this.em.findOne(Like, {
      post: postId,
      owner: currUserId,
    });
    if (existingLike) {
      await this.em.removeAndFlush(existingLike);
      return existingLike;
    }
    throw new HttpException('Like not found', HttpStatus.BAD_REQUEST);
  }
}
