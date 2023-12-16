import { Entity, ManyToOne } from '@mikro-orm/core';

import { BaseModel } from '../orm/base-model.entity';
import { User } from '../users/user.entity';
import { Userpost } from '../posts/userpost.entity';

@Entity()
export class Like extends BaseModel {
  @ManyToOne(() => Userpost)
  post!: Userpost;

  @ManyToOne(() => User)
  owner!: User;

  public setOwner(owner: User) {
    this.owner = owner.uuid;
  }

  public getOwner(): User {
    return this.owner;
  }

  public setPost(post: Userpost) {
    this.post = post;
  }

  public getPost(): Userpost {
    return this.post;
  }
}
