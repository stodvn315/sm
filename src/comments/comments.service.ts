import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { User } from '../users/user.entity';
import { Userpost } from '../posts/userpost.entity';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly em: EntityManager) {}

  async getPostComments(postUuid: string): Promise<Comment[]> {
    return await this.em.find(Comment, { post: postUuid });
  }

  async createComment(
    commentDto: CreateCommentDto,
    postUuid: string,
    userUuid: string,
  ): Promise<Comment> {
    const comment = new Comment(commentDto.content);
    const post = await this.em.getReference(Userpost, postUuid);
    const user = await this.em.getReference(User, userUuid);
    if (user && post) {
      comment.setPost(post);
      comment.setOwner(user);
      await this.em.persistAndFlush(comment);
      return comment;
    }
    throw new BadRequestException('User or post not found');
  }

  async deleteComment(
    commentUuid: string,
    currUserUuid: string,
  ): Promise<Comment> {
    const comment = await this.em.findOne(Comment, commentUuid, {
      populate: ['owner'],
    });
    const currUser = await this.em.findOne(User, currUserUuid);
    if (comment.getOwner().getUuid() === currUser.getUuid()) {
      await this.em.removeAndFlush(comment);
      return comment;
    }
    throw new UnauthorizedException("Comment doesn't belong to this user");
  }
}
