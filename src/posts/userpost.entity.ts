import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

import { BaseModel } from '../orm/base-model.entity';
import { Comment } from '../comments/comment.entity';
import { Like } from '../likes/like.entity';
import { User } from '../users/user.entity';

@Entity()
export class Userpost extends BaseModel {
  @Property()
  content!: string;

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  image?: string;

  @ManyToOne(() => User)
  owner!: User;

  @OneToMany(() => Like, (like) => like.post)
  likes = new Collection<Like>(this);

  @OneToMany(() => Comment, (comment) => comment.post)
  comments = new Collection<Comment>(this);

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

  public setImage(image: string) {
    this.image = image;
  }

  public getImage(): string {
    return this.image;
  }

  public setOwner(owner: User) {
    this.owner = owner.uuid;
  }

  public getOwner(): User {
    return this.owner;
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
