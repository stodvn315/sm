import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ abstract: true })
export abstract class BaseModel {
  @PrimaryKey()
  uuid = v4();

  @Property()
  createdAt = new Date();

  public getUuid(): string {
    return this.uuid;
  }

  public getCreationDate(): Date {
    return this.createdAt;
  }
}
