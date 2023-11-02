import {
  Property,
  Entity,
  Unique,
  PrimaryKey,
  OneToMany,
  Collection,
  ManyToOne,
  OneToOne,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey()
  uuid = v4();

  @Property()
  @Unique()
  username: string;

  @Property()
  password: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Userpost, (post) => post.owner)
  posts = new Collection<Userpost>(this);

  @OneToMany(() => Like, (like) => like.owner)
  likes = new Collection<Like>(this);

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments = new Collection<Comment>(this);

  @OneToMany(() => Subscription, (sub) => sub.owner)
  subscriptions = new Collection<Subscription>(this);

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

@Entity()
export class Userpost {
  @PrimaryKey()
  uuid = v4();

  @Property()
  content!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToOne(() => User, { mapToPk: true })
  owner!: User;

  @OneToMany(() => Like, (like) => like.post)
  likes = new Collection<Like>(this);

  @OneToMany(() => Comment, (comment) => comment.post)
  comments = new Collection<Comment>(this);

  constructor(content: string) {
    this.content = content;
  }
}

@Entity()
export class Like {
  @PrimaryKey()
  uuid = v4();

  @ManyToOne(() => Userpost, { mapToPk: true })
  post!: Userpost;

  @ManyToOne(() => User, { mapToPk: true })
  owner!: User;
}

@Entity()
export class Comment {
  @PrimaryKey()
  uuid = v4();

  @Property()
  content!: string;

  @Property()
  createdAt = new Date();

  @ManyToOne(() => Userpost, { mapToPk: true })
  post!: Userpost;

  @ManyToOne(() => User, { mapToPk: true })
  owner!: User;

  constructor(content: string) {
    this.content = content;
  }
}

@Entity()
export class Subscription {
  @PrimaryKey()
  uuid = v4();

  @OneToOne({ mapToPk: true })
  subscription!: User;

  @ManyToOne(() => User, { mapToPk: true })
  owner!: User;
}
