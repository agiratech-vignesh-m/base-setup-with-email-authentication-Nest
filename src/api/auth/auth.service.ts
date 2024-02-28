import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { error, success } from 'src/config/yaml.config';
import { Profile } from 'src/entities/profile.entity';
import { loginDto, signUpDto } from './dto/auth_otp.dto';
import {
  comparePassword,
  emailVerificationResponse,
  encryptPassword,
  generateOtp,
} from 'src/utils/helper.utils';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { resendOtpDto, verifyOtpDto } from './dto/auth_otp.dto';
import { eOtpLoginDto } from './dto/auth_email_link.dto';
import { IJwtConfig, JwtTypeEnum } from 'src/utils/interface.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  // OTP Based Authentication

  async createUser(data: signUpDto): Promise<any> {
    // let profile: Profile;
    let user: User;
    try {
      let query: any = {};
      // Need to check it from database
      if (data.email) {
        // const encryptEmail = await encrypt(data.email);
        // data.email = encryptEmail;
        query.email = data.email;
      }
      const save = await this.usersRepository.findOne({
        where: query,
        relations: ['profile'],
      });

      // if found return error
      if (save) {
        throw new HttpException(error?.duplicateEmail, HttpStatus.BAD_REQUEST);
      }
      // hash the password
      if (data.password) {
        const hash = await encryptPassword(data.password);
        data.password = hash;
      }

      // save user into database
      user = await this.usersRepository.save(data);

      // generate OTP
      const minutes = this.configService.get<number>('otpExpiryTime');
      const expiry_time = new Date(new Date().getTime() + minutes * 60000);
      const otp = generateOtp();

      const updateOTP = await this.usersRepository.update(user.id, {
        otp: otp,
        otp_expiry_time: expiry_time,
      });

      if (!updateOTP) {
        throw new HttpException(error?.standardError, HttpStatus.BAD_REQUEST);
      }

      const email = await this.mailService.sendOtp(user.email, otp);
      if (!email) {
        throw new HttpException(error?.standardError, HttpStatus.BAD_REQUEST);
      }

      return {
        message: 'OTP successfully send to registered email address',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.log('Error', error);
      throw new HttpException(
        error?.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyOtp(data: verifyOtpDto): Promise<any> {
    try {
      const user = await this.findByEmail(data.email);

      if (data.otp && data.otp === user.otp) {
        if (user.otp_expiry_time > new Date()) {
          const update_status = await this.usersRepository.update(user.id, {
            email_verified: true,
            otp: null,
            otp_expiry_time: null,
          });
          if (!update_status) {
            throw new HttpException(
              error?.standardError,
              HttpStatus.BAD_REQUEST,
            );
          }
          return {
            message: 'OTP verified successfully',
            statusCode: HttpStatus.OK,
          };
        }
        throw new HttpException(error?.otp_expired, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(error?.invalidOtp, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log('Error', error.response);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resendOtp(data: resendOtpDto): Promise<any> {
    const user = await this.findByEmail(data.email);
    console.log('User', user);

    if(user.email_verified){
      throw new HttpException(error?.alreadyVerified, HttpStatus.BAD_REQUEST);
    }

    // generate OTP
    const minutes = this.configService.get<number>('otpExpiryTime');
    const expiry_time = new Date(new Date().getTime() + minutes * 60000);
    const otp = generateOtp();

    const updateOTP = await this.usersRepository.update(user.id, {
      otp: otp,
      otp_expiry_time: expiry_time,
    });

    if (!updateOTP) {
      throw new HttpException(error?.standardError, HttpStatus.BAD_REQUEST);
    }

    const email = await this.mailService.sendOtp(user.email, otp);
    if (!email) {
      throw new HttpException(error?.standardError, HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'OTP successfully send to registered email address',
      statusCode: HttpStatus.OK,
    };
  }

  async login(data: loginDto): Promise<any> {
    try {
      // need to get the user by email
      const validate_user = await this.findByEmail(data.email);
      console.log('validate_user', validate_user);
      // validate the password
      if (!validate_user || !validate_user.email_verified) {
        throw new HttpException(
          error?.email_not_verified,
          HttpStatus.BAD_REQUEST,
        );
      }

      const validate_password = await comparePassword(data.password, validate_user.password);

      if(!validate_password){
        throw new HttpException(error?.passwordError, HttpStatus.BAD_REQUEST);
      }

      // generate OTP
      const minutes = this.configService.get<number>('otpExpiryTime');
      const expiry_time = new Date(new Date().getTime() + minutes * 60000);
      const otp = generateOtp();

      const email = await this.mailService.loginOtp(validate_user.email, otp);
      console.log('email', email);
      if (!email) {
        throw new HttpException(error?.standardError, HttpStatus.BAD_REQUEST);
      }

      const updateOTP = await this.usersRepository.update(validate_user.id, {
        otp: otp,
        otp_expiry_time: expiry_time,
      });
      console.log('updateOTP', updateOTP);
      if (!updateOTP) {
        throw new HttpException(error?.standardError, HttpStatus.BAD_REQUEST);
      }
      const check = success?.otpLoginRequest;
      console.log('check', check);
      return {
        message: success?.otpLoginRequest,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.log('error', error.response);
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async eOtpLogin(data: eOtpLoginDto): Promise<any> {
    try {
      const user = await this.findByEmail(data.email);
      const { id, email, role } = user;

      if (data.otp && data.otp === user.otp) {
        if (user.otp_expiry_time > new Date()) {
          const update_status = await this.usersRepository.update(user.id, {
            email_verified: true,
            otp: null,
            otp_expiry_time: null,
          });
          if (!update_status) {
            throw new HttpException(
              error?.standardError,
              HttpStatus.BAD_REQUEST,
            );
          }
          if (!user || !user.email_verified) {
            throw new HttpException(
              error?.email_not_verified,
              HttpStatus.BAD_REQUEST,
            );
          }
          const payload = {
            id,
            email,
            role,
            type: JwtTypeEnum.LOGIN,
          };
          const secret = this.configService.get<IJwtConfig>('jwt');
          const token = await this.jwtService.signAsync(payload, {
            secret: secret.secret,
          });

          return {
            message: success.login,
            data: {
              id,
              email,
              token,
            },
            statusCode: HttpStatus.OK,
          };
        }
        throw new HttpException(error?.otp_expired, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(error?.invalidOtp, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log('Error', error);
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword(): Promise<any> {
    try {
      // get the user from email
      // generate otp and send to user
      // update otp details in db
      // return message
    } catch (error) {
      console.log('error', error.response);
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyOtpForPassword(): Promise<any> {
    try {
      // get the user
      // verift the otp
      // create the forgot_password_hash and update it in DB
      // return the hash
    } catch (error) {
      console.log('error', error.response);
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(): Promise<any> {
    try {
      // get the user with forgot_password_hash
      // validate the hash are same
      // hash the new password
      // update the new password and hash to null in the db
    } catch (error) {
      console.log('error', error.response);
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async chagePassword(): Promise<any> {
    try {
      // get user from req.user from JWT token
      // Check whether the old password is same
      // hash the new password
      // Update the new password
      // return the response
    } catch (error) {
      console.log('error', error.response);
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByEmail(email: string): Promise<any> {
    let query: any = {};
    query.email = email;
    const user = await this.usersRepository.findOne({
      where: query,
      relations: ['profile'],
    });
    // if found return error
    if (!user) {
      throw new HttpException(error?.userNotFound, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async getUser(id: number): Promise<any> {
    let query: any = {};
    query.id = id;

    const user = await this.usersRepository.findOne({
      where: query,
      relations: ['profile'],
    });

    return user;
  }

  // Email link based authentication

  async eCreateUser(data: signUpDto): Promise<any> {
    let user: User;
    try {
      let query: any = {};
      query.email = data.email;
      const validate_user = await this.usersRepository.findOne({
        where: query,
        relations: ['profile'],
      });
      // hash the password
      if (data.password) {
        const hash = await encryptPassword(data.password);
        data.password = hash;
      }

      // save user into database
      user = await this.usersRepository.save(data);

      // generate OTP
      const minutes = this.configService.get<number>('otpExpiryTime');
      const expiry_time = new Date(new Date().getTime() + minutes * 60000);
      const token = generateOtp();

      const updateToken = await this.usersRepository.update(user.id, {
        email_verification_token: token,
        email_expiry_time: expiry_time,
      });

      if (!updateToken) {
        throw new HttpException(error?.standardError, HttpStatus.BAD_REQUEST);
      }

      const email = await this.mailService.sendEmailVerificationLink(
        user.email,
        token,
      );
      if (!email) {
        throw new HttpException(error?.standardError, HttpStatus.BAD_REQUEST);
      }

      return {
        message: 'Email verification link sent successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.log('Error', error);
      throw new HttpException(
        error?.message,
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async eVerifyEmail(token: string): Promise<any> {
    let query: any = {};
    query.email_verification_token = token;
    try {
      const user = await this.usersRepository.findOne({
        where: query,
      });

      if (!user) {
        throw new HttpException(error?.invalid_link, HttpStatus.BAD_REQUEST);
      }

      if (user && user.email_verification_token === token) {
        if (user.email_expiry_time > new Date()) {
          const update_status = await this.usersRepository.update(user.id, {
            email_verified: true,
            email_verification_token: null,
            email_expiry_time: null,
          });
          if (!update_status) {
            throw new HttpException(
              error?.standardError,
              HttpStatus.BAD_REQUEST,
            );
          }
          // const response = emailVerificationResponse()
          return {
            message: 'Email verified successfully',
            statusCode: HttpStatus.OK,
          };
        }
        throw new HttpException(error?.token_expired, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(error?.invalid_token, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log('Error', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
