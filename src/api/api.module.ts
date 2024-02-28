import { Module, UseGuards } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CouponModule } from './coupons/coupon.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './uploads/upload.module';
import { BadgeService } from './badge/badge.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { Badge } from 'src/entities/badge.entity';
import { Admin } from 'src/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      User,
      Badge,
      Admin
    ]),
    UserModule, 
    CouponModule, 
    MailModule, 
    AuthModule, 
    UploadModule],
  exports: [],
  // If other modules uses the common serive then we need to declare it here
  providers: [MailService, BadgeService],
})
export class ApiModule {}
