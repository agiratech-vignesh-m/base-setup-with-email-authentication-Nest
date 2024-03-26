import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, resendOtpDto, verifyOtpDto } from './dto/auth_otp.dto';
import { signUpDto } from './dto/auth_otp.dto';
import { eOtpLoginDto } from './dto/auth_email_link.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { Request } from 'express';
import { UserRegisterDto } from './dto/wallet.dto';

@Controller({
  version: ["1"],
  path: "auth",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Otp Based Authentication
  @HttpCode(HttpStatus.OK)
  @Post('register')
  createUser(@Body() data: signUpDto) {
    return this.authService.createUser(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify_otp')
  verifyOtp(@Body() data: verifyOtpDto) {
    return this.authService.verifyOtp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend_otp')
  resendOtp(@Body() data: resendOtpDto) {
    return this.authService.resendOtp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    // @Req() req: Request,
    @Body() data: loginDto) {
    return this.authService.login(data);
  }

  // Email link Based Authentication
  @HttpCode(HttpStatus.OK)
  @Post('e_register')
  eCreateUser(@Body() data: signUpDto) {
    return this.authService.eCreateUser(data);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string): Promise<any> {
    console.log("token", token)
    return await this.authService.eVerifyEmail(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('e_otp_login')
  eOtpLogin(@Body() data: eOtpLoginDto) {
    return this.authService.eOtpLogin(data);
  }

  @Get('/')
  @UseGuards(AuthGuard, JwtAuthGuard)
  getUser( @Req() request: Request) {
    const data = request.user
    return this.authService.getUser(data.id)
  }

   // Otp Based Authentication
   @HttpCode(HttpStatus.OK)
   @Post('createUserWallet')
   createUserWallet(@Body() data: UserRegisterDto) {
     return this.authService.createUserWallet(data);
   }

  // @Post('forgot_password')
  // login(@Body() authPyload: AuthPayloadDto) {
  //   return this.authService.valiadteUser(authPyload);
  // }

  // @Post('verify_otp')
  // login(@Body() authPyload: AuthPayloadDto) {
  //   return this.authService.valiadteUser(authPyload);
  // }

  // @Post('reset_password')
  // login(@Body() authPyload: AuthPayloadDto) {
  //   return this.authService.valiadteUser(authPyload);
  // }

  // @Post('change_password')
  // login(@Body() authPyload: AuthPayloadDto) {
  //   return this.authService.valiadteUser(authPyload);
  // }
}
