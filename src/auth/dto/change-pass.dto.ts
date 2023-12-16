import { IsString } from 'class-validator';

export class ChangePassDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly oldPassword: string;
}
