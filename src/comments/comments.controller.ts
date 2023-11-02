import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Headers,
  Body,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Comment } from 'src/models/all.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getPostComments(@Param('postId') postId: string): Promise<Comment[]> {
    return this.commentsService.getPostComments(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Headers('authorization') auth: string,
    @Param('postId') postId: string,
    @Body() createDto: CreateCommentDto,
  ): Promise<Comment> {
    const { id } = Object(this.jwtService.decode(auth.split(' ')[1]));
    return this.commentsService.createComment(createDto, postId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(
    @Headers('authorization') auth: string,
    @Param('id') commentId: string,
  ): Promise<Comment> {
    const { id } = Object(this.jwtService.decode(auth.split(' ')[1]));
    return this.commentsService.deleteComment(commentId, id);
  }
}
