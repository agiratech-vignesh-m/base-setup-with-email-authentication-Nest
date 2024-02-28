import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import path from 'path';
import { error } from 'src/config/yaml.config';
import * as fs from "fs";

@Injectable()
export class UploadService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  async deleteUpload(body: any): Promise<any> {
    try {
      fs.unlinkSync(`./public/${body?.path}`);
      return {
          message: 'Image deleted successfully',
          statusCode: HttpStatus.OK
      };

    } catch (error) {
      
    }
  }
  }
