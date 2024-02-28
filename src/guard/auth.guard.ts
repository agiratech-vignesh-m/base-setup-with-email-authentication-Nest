import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest() as Request;
      console.log('request.headers', request.headers);
      const secretKey = request.headers['api-secret-key'];
      const validateKey = this.configService.get<string>('secret_key');
      console.log('validateKey', validateKey);
      if (secretKey && secretKey === validateKey) {
        return true;
      }
      throw new HttpException(
        'Failed to authenticate secret',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      throw new HttpException('Failed to authenticate', HttpStatus.BAD_REQUEST);
    }
  }
}
