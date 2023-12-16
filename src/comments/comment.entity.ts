import { Entity, Property, ManyToOne } from '@mikro-orm/core';

import { BaseModel } from '../orm/base-model.entity';
import { Userpost } from '../posts/userpost.entity';
import { User } from '../users/user.entity';

@Entity()
export class Comment extends BaseModel {
  @Property()
  content!: string;

  @ManyToOne(() => Userpost)
  post!: Userpost;

  @ManyToOne(() => User)
  owner!: User;

  constructor(content: string) {
    super();
    this.content = content;
  }

  public setContent(content: string) {
    this.content = content;
  }

  public getContent(): string {
    return this.content;
  }

  public setOwner(owner: User) {
    this.owner = owner.uuid;
  }

  public getOwner(): User {
    return this.owner;
  }

  public setPost(post: Userpost) {
    this.post = post.uuid;
  }

  public getPost(): Userpost {
    return this.post;
  }

  public getUuid(): string {
    return super.getUuid();
  }
}
