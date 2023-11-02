import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from 'src/auth/auth.module';
import { Subscription, User } from 'src/models/all.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Subscription, User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
