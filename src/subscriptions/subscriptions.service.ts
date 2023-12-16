import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Subscription } from './subscription.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly em: EntityManager) {}

  async subscribe(
    targetUserUuid: string,
    currUserUuid: string,
  ): Promise<Subscription> {
    const existingSubscription = await this.em.findOne(Subscription, {
      subscriptionTarget: targetUserUuid,
      subscriber: currUserUuid,
    });
    if (existingSubscription) {
      throw new BadRequestException('Already subscribed');
    }
    const subscription = new Subscription();
    const subscriber = await this.em.getReference(User, currUserUuid);
    const targetUser = await this.em.getReference(User, targetUserUuid);
    if (subscriber && targetUser) {
      subscription.setSubscriber(subscriber);
      subscription.setSubscriptionTarget(targetUser);
      await this.em.persistAndFlush(subscription);
      return subscription;
    }
    throw new BadRequestException('User not found');
  }

  async unsubscribe(
    targetUserUuid: string,
    currUserUuid: string,
  ): Promise<Subscription> {
    const existingSubscription = await this.em.findOne(Subscription, {
      subscriptionTarget: targetUserUuid,
      subscriber: currUserUuid,
    });
    if (existingSubscription) {
      await this.em.removeAndFlush(existingSubscription);
      return existingSubscription;
    }
    throw new BadRequestException('Already unsubscribed');
  }
}
