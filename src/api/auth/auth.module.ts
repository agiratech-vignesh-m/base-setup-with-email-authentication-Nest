import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from '../user/user.service';
import { Profile } from 'src/entities/profile.entity';
import { MailService } from '../mail/mail.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      global: true,
      secret: configService.get("jwt").secret,
      signOptions: { expiresIn: configService.get("jwt").expiresIn },
    }),
    inject: [ConfigService],
  }),
  TypeOrmModule.forFeature([User, Profile])
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, MailService],
  exports:[AuthService]
})
export class AuthModule {}
