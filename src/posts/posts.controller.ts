import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserId } from '../decorators/user-id.decorator';
import { FilesService } from '../files/files.service';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  getAll() {
    return this.postsService.getAll();
  }

  @Get('feed')
  getFeed(@UserId() currUserUuid: string) {
    return this.postsService.getFeed(currUserUuid);
  }

  @Get(':uuid')
  getById(@Param('uuid') uuid: string) {
    return this.postsService.getById(uuid);
  }

  @Get('user/:userUuid')
  getUserPosts(@Param('userUuid') userUuid: string) {
    return this.postsService.getUserPosts(userUuid);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPost(
    @UserId() currUserUuid: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const fileName = this.filesService.createFile(file);
    return this.postsService.createPost(createPostDto, currUserUuid, fileName);
  }

  @Put(':postUuid')
  @UseInterceptors(FileInterceptor('image'))
  async updatePost(
    @UserId() currUserUuid: string,
    @Param('postUuid') postUuid: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const fileName = this.filesService.createFile(file);
    const oldFileName = await this.postsService.getPostPhoto(postUuid);
    const updatedPost = this.postsService.updatePost(
      createPostDto,
      currUserUuid,
      postUuid,
      fileName,
    );
    if (await updatedPost) {
      this.filesService.deleteFile(oldFileName);
    }
    return updatedPost;
  }

  @Delete(':postUuid')
  async deletePost(
    @UserId() currUserUuid: string,
    @Param('postUuid') postUuid: string,
  ) {
    const oldFileName = await this.postsService.getPostPhoto(postUuid);
    const deletedPost = await this.postsService.deletePost(
      postUuid,
      currUserUuid,
    );
    if (deletedPost) {
      this.filesService.deleteFile(oldFileName);
    }
    return deletedPost;
  }
}
