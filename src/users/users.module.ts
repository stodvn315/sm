import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User, Like, Userpost } from '../models/all.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Like, Userpost]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
