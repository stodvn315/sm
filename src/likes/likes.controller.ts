import {
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Like } from 'src/models/all.entity';

@Controller('posts/:postId/likes')
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createLike(
    @Headers('authorization') auth: string,
    @Param('postId') postId: string,
  ): Promise<Like> {
    const { id } = Object(this.jwtService.decode(auth.split(' ')[1]));
    return this.likesService.createLike(postId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteLike(
    @Headers('authorization') auth: string,
    @Param('postId') postId: string,
  ): Promise<Like> {
    const { id } = Object(this.jwtService.decode(auth.split(' ')[1]));
    return this.likesService.deleteLike(postId, id);
  }
}
