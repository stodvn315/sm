import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Userpost } from '../posts/userpost.entity';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { Like } from '../likes/like.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import mikroOrmConfig from '../mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync(mikroOrmConfig),
    MikroOrmModule.forFeature([User, Like, Userpost, Subscription, Comment]),
  ],
  exports: [OrmModule],
})
export class OrmModule {}
