import { Module, forwardRef } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from 'src/auth/auth.module';
import { Like, Userpost, User } from 'src/models/all.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Like, Userpost, User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
