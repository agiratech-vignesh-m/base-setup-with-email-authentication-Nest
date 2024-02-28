import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthService } from "src/api/auth/auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const user = await this.checkUser(request);
      console.log("user", user)
      if (user) {
        request.user = user;
        return true;
      } else {
        throw new UnauthorizedException();
      }
    } catch (err) {
      console.log("error", err);
      throw new UnauthorizedException();
    }
  }

  private async checkUser(request: Request) {
    try {
     let token = request.headers.authorization;
     console.log("token", token)
      if (!token) {
        return false;
      } else if (!token.includes("Bearer ")) {
        return false;
      } else {
        token = token.replace("Bearer ", "");
        const data = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString()
        );
        console.log("data", data)
        const expiryDate = new Date(data.exp * 1000);
        if (expiryDate < new Date()) {
          console.log("Token time expired");
          return false;
        }
        const user = await this.authService.getUser(data.id)
        console.log("Jwt-user", user)
        if(user){
          return user;
        }
        return false;
      }
    } catch (err) {
      console.log("error", err);
      throw new Error(err);
    }
  }
}
