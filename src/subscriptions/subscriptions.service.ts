import { EntityManager } from '@mikro-orm/core';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Subscription, User } from 'src/models/all.entity';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly em: EntityManager) {}

  async subscribe(userId: string, currUserId: string): Promise<Subscription> {
    const existingSubscription = await this.em.findOne(Subscription, {
      subscription: userId,
      owner: currUserId,
    });
    if (existingSubscription) {
      throw new HttpException('Already subscribed', HttpStatus.BAD_REQUEST);
    }
    const subscription = new Subscription();
    subscription.owner = (await this.em.getReference(User, currUserId)).uuid;
    subscription.subscription = (await this.em.getReference(User, userId)).uuid;
    await this.em.persistAndFlush(subscription);
    return subscription;
  }

  async unsubscribe(userId: string, currUserId: string): Promise<Subscription> {
    const existingSubscription = await this.em.findOne(Subscription, {
      subscription: userId,
      owner: currUserId,
    });
    if (existingSubscription) {
      await this.em.removeAndFlush(existingSubscription);
      return existingSubscription;
    }
    throw new HttpException('Already unsubscribed', HttpStatus.BAD_REQUEST);
  }
}
