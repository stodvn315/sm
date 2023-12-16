import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  createFile(file: Express.Multer.File): string {
    try {
      if (!file) {
        return null;
      }
      const fileName = `${uuid.v4()}.jpg`;
      fs.writeFileSync(this.getFullFilePath(fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new InternalServerErrorException('Error while writing file');
    }
  }

  async deleteFile(fileName: string) {
    try {
      if (fileName) {
        fs.unlinkSync(this.getFullFilePath(await fileName));
      }
    } catch (e) {
      throw new InternalServerErrorException('Error while deleting file');
    }
  }

  private getFullFilePath(fileName: string) {
    const filePath = path.resolve(__dirname, '..', '..', 'src/static');
    return path.join(filePath, fileName);
  }
}
