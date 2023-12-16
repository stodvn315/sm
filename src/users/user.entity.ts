import {
  Entity,
  Property,
  Unique,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

import { BaseModel } from '../orm/base-model.entity';
import { Userpost } from '../posts/userpost.entity';
import { Comment } from '../comments/comment.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import { Like } from '../likes/like.entity';

@Entity()
export class User extends BaseModel {
  @Property()
  @Unique()
  username: string;

  @Property()
  password: string;

  @Property()
  bio: string;

  @Property({ nullable: true })
  image?: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Userpost, (post) => post.owner)
  posts = new Collection<Userpost>(this);

  @OneToMany(() => Like, (like) => like.owner)
  likes = new Collection<Like>(this);

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments = new Collection<Comment>(this);

  @OneToMany(() => Subscription, (sub) => sub.subscriber)
  subscriptions = new Collection<Subscription>(this);

  @OneToMany(() => Subscription, (sub) => sub.subscriptionTarget)
  subcribers = new Collection<Subscription>(this);

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = password;
  }

  public setUsername(username: string) {
    this.username = username;
  }

  public getUsername(): string {
    return this.username;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public getPassword(): string {
    return this.password;
  }

  public setBio(bio: string) {
    this.bio = bio;
  }

  public getBio(): string {
    return this.bio;
  }

  public setImage(image: string) {
    this.image = image;
  }

  public getImage(): string {
    return this.image;
  }

  public getUuid(): string {
    return super.getUuid();
  }

  public getCreationDate(): Date {
    return super.getCreationDate();
  }

  public getDateOfUpdate(): Date {
    return this.updatedAt;
  }
}
