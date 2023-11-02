import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Comment, User, Userpost } from 'src/models/all.entity';
import { CreateCommentDto } from './dto/createComment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly em: EntityManager) {}

  async getPostComments(postId: string): Promise<Comment[]> {
    return await this.em.find(Comment, { post: postId });
  }

  async createComment(
    createDto: CreateCommentDto,
    postId: string,
    userId: string,
  ): Promise<Comment> {
    const { content } = createDto;
    const comment = new Comment(content);
    const postRef = this.em.getReference(Userpost, postId);
    const userRef = this.em.getReference(User, userId);
    comment.post = postRef.uuid;
    comment.owner = userRef.uuid;
    await this.em.persistAndFlush(comment);
    return comment;
  }

  async deleteComment(commentId: string, currUserId: string): Promise<Comment> {
    const comment = await this.em.findOne(Comment, commentId);
    const userRef = await this.em.getReference(User, currUserId);
    if (comment.owner === userRef.uuid) {
      await this.em.removeAndFlush(comment);
      return comment;
    }
    throw new UnauthorizedException({
      message: "Comment doesn't belong to this user",
    });
  }
}
