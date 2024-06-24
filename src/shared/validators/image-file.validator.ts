import { FileValidator } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class ImageFileValidator extends FileValidator {
  constructor(
    options,
  ) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    if (file.size > 2097152) {
      return false;
    }
    return true;
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `Too large 2mb`;
  }
}