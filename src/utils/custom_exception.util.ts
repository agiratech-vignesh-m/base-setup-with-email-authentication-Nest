import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, status: HttpStatus, isBlockchainError: boolean) {
    super(
      {
        message,
        isBlockchainError,  // Add this property
      },
      status,
    );
  }
}
