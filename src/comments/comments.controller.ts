import { Controller, Delete, Get, Param, Post, Body } from '@nestjs/common';

import { UserId } from '../decorators/user-id.decorator';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('posts/:postUuid/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getPostComments(@Param('postUuid') postUuid: string): Promise<Comment[]> {
    return this.commentsService.getPostComments(postUuid);
  }

  @Post()
  async createComment(
    @UserId() currUserUuid: string,
    @Param('postUuid') postUuid: string,
    @Body() createDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.createComment(
      createDto,
      postUuid,
      currUserUuid,
    );
  }

  @Delete(':uuid')
  async deleteComment(
    @UserId() currUserUuid: string,
    @Param('uuid') commentUuid: string,
  ): Promise<Comment> {
    return this.commentsService.deleteComment(commentUuid, currUserUuid);
  }
}
