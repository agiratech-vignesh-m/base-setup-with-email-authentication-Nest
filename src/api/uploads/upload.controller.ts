import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { fileStorage, fileValidator } from 'src/utils/file.utils';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  // Upload single image
  @Post('/')
  @UseGuards(AuthGuard, JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', fileStorage))
  async imageUpload(
    @UploadedFile(fileValidator) file: Express.Multer.File,
  ): Promise<any> {
    const url = this.configService.get<string>('image_url');
    const pathTemp = file.path.replace(/^public\//, '');
    const path = `${url}${pathTemp}`;
    return path;
  }

  // Upload multiple images

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file' }]))
  async uploadFile(
     @UploadedFiles()
    files
    // : {
    //   avatar?: Express.Multer.File[];
    //   background?: Express.Multer.File[];
    // },
  ) 
  {
    console.log(files);
  }

  @Delete('')
  async DeleteUpload(@Body() body: string): Promise<any> {
    return await this.uploadService.deleteUpload(body);
  }
}
