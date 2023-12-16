import { Entity, ManyToOne } from '@mikro-orm/core';

import { BaseModel } from '../orm/base-model.entity';
import { User } from '../users/user.entity';

@Entity()
export class Subscription extends BaseModel {
  @ManyToOne(() => User)
  subscriptionTarget!: User;

  @ManyToOne(() => User)
  subscriber!: User;

  public getSubscriptionTarget(): User {
    return this.subscriptionTarget;
  }

  public setSubscriptionTarget(subscription: User) {
    this.subscriptionTarget = subscription.uuid;
  }

  public getSubcriber(): User {
    return this.subscriber;
  }

  public setSubscriber(subscriber: User) {
    this.subscriber = subscriber.uuid;
  }
}
