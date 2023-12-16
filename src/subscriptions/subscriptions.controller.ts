import { Controller, Post, Param, Delete } from '@nestjs/common';

import { UserId } from '../decorators/user-id.decorator';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.entity';

@Controller('users/:targetUserUuid/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subsService: SubscriptionsService) {}

  @Post()
  subscribe(
    @UserId() currUserUuid: string,
    @Param('targetUserUuid') targetUserUuid: string,
  ): Promise<Subscription> {
    return this.subsService.subscribe(targetUserUuid, currUserUuid);
  }

  @Delete()
  unsubscribe(
    @UserId() currUserUuid: string,
    @Param('targetUserUuid') targetUserUuid: string,
  ): Promise<Subscription> {
    return this.subsService.unsubscribe(targetUserUuid, currUserUuid);
  }
}
