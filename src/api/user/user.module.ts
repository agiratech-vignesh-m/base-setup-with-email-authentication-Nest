import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { Profile } from 'src/entities/profile.entity';
import { AuthModule } from '../auth/auth.module';
import { Badge } from 'src/entities/badge.entity';
import { BadgeService } from '../badge/badge.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Badge]),
    JwtModule,
    HttpModule,
    AuthModule
],
  controllers: [UserController],
  providers: [
    UserService,
    MailService,
    BadgeService
  ],
  exports: [UserService]
})
export class UserModule {}
