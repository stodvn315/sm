import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { UserId } from '../decorators/user-id.decorator';
import { LikesService } from './likes.service';

@Controller('posts/:postUuid/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  getPostLikes(@Param('postUuid') postUuid: string) {
    return this.likesService.getPostLikes(postUuid);
  }

  @Post()
  createLike(
    @UserId() currUserUuid: string,
    @Param('postUuid') postUuid: string,
  ) {
    return this.likesService.createLike(postUuid, currUserUuid);
  }

  @Delete()
  deleteLike(
    @UserId() currUserUuid: string,
    @Param('postUuid') postUuid: string,
  ) {
    return this.likesService.deleteLike(postUuid, currUserUuid);
  }
}
