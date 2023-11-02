import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [MikroOrmModule.forRoot(), UsersModule, PostsModule, AuthModule, CommentsModule, LikesModule, SubscriptionsModule],
  controllers: [],
})
export class AppModule {}
