import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { CreateProfileDto } from './dto/create_profile.dto';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { Request } from 'express';
import { createBadgeDto } from './dto/badge.dto';
import { BadgeService } from '../badge/badge.service';
import { Web3Service } from '../web3/web3.service';
import { IWeb3PublicTransfer } from 'src/utils/interface.utils';
// import { Request } from 'express';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly badgeService: BadgeService,
    private readonly web3Service: Web3Service,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  // Guards act as an Authentication
  @UseGuards(AuthGuard, JwtAuthGuard)
  createProfile(
    @Req() request: Request,
    @Body() body: CreateProfileDto,
  ): Promise<any> {
    const data = request.user;
    return this.userService.createProfile(data, body);
  }

  @Post('create_badge')
  @UseGuards(AuthGuard, JwtAuthGuard)
  addBadge(@Req() request: Request, @Body() badge: createBadgeDto) {
    const data = request.user.profile;
    return this.badgeService.addBadge(data.id, badge);
  }

  @Get('')
  @UseGuards(AuthGuard, JwtAuthGuard)
  getProfile(@Req() request: Request) {
    const data = request.user.profile;
    return this.userService.getProfile(data.id);
  }

  @Post('web3_check')
  async web3Check( @Body() body: IWeb3PublicTransfer) {
    const check = await this.web3Service.publicTransfer(body);
    console.log('Check', check);
    return check;
  }
}
