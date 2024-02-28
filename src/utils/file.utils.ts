import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';

export const fileStorage = {
  storage: diskStorage({
    destination: './public/images',
    filename: (req, file, callback) => {
      const filenameTemp: string = path
        .parse(file.originalname)
        .name.replace(/\s/g, '');
      const filename = `${filenameTemp}_${uuidv4()}`;
      const ext: string = path.parse(file.originalname).ext;
      callback(null, `${filename}${ext}`);
    },
  }),
};

export const fileValidator = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
    new FileTypeValidator({ fileType: /.*/ }),
  ],
});

export const customFileValidator = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: 'jpeg',
  })
  .addMaxSizeValidator({
    maxSize: 1000,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
