import { Module, forwardRef } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from 'src/auth/auth.module';
import { Userpost, User, Comment } from 'src/models/all.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Userpost, User, Comment]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
