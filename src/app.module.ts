import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { OrmModule } from './orm/orm.module';
import { FilesModule } from './files/files.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    OrmModule,
    UsersModule,
    PostsModule,
    AuthModule,
    CommentsModule,
    LikesModule,
    SubscriptionsModule,
    FilesModule,
  ],
})
export class AppModule {}
