import { Module, forwardRef } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User, Userpost, Like } from 'src/models/all.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Like, Userpost, User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
