import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Userpost } from 'src/models/all.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<Userpost[]> {
    return this.postsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string): Promise<Userpost> {
    return this.postsService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  getUserPosts(@Param('id') id: string): Promise<Userpost[]> {
    return this.postsService.getUserPosts(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(
    @Headers('authorization') auth: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<Userpost> {
    const { id } = Object(this.jwtService.decode(auth.split(' ')[1]));
    return this.postsService.createPost(createPostDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(
    @Headers('authorization') auth: string,
    @Param('id') postId: string,
  ): Promise<Userpost> {
    const { id } = Object(this.jwtService.decode(auth.split(' ')[1]));
    return this.postsService.deletePost(postId, id);
  }
}
