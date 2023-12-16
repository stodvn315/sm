import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { FilesService } from '../files/files.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.usersService.getOne(uuid);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createUser(
    @Body() userDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const photo = this.filesService.createFile(file);
    return this.usersService.createUser(userDto, photo);
  }

  @Put(':uuid')
  @UseInterceptors(FileInterceptor('image'))
  async updateUser(
    @Param('uuid') uuid: string,
    @Body() userDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const newPhoto = this.filesService.createFile(file);
    const oldPhoto = await this.usersService.getUserPhoto(uuid);
    const updatedUser = await this.usersService.updateUser(
      uuid,
      userDto,
      newPhoto,
    );
    if (updatedUser) {
      this.filesService.deleteFile(oldPhoto);
    }
    return updatedUser;
  }

  @Delete(':uuid')
  async deleteUser(@Param('uuid') uuid: string) {
    const photo = await this.usersService.getUserPhoto(uuid);
    const deletedUser = await this.usersService.deleteUser(uuid);
    if (deletedUser) {
      this.filesService.deleteFile(photo);
    }
    return deletedUser;
  }
}
