import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsOptional()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsBoolean()
  readonly isChangePass?: boolean;

  @IsOptional()
  @IsString()
  readonly bio?: string;
}
