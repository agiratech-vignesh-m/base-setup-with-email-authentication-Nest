import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'src/config/yaml.config';
import { Badge } from 'src/entities/badge.entity';
import { Profile } from 'src/entities/profile.entity';
import { IBadgeDetails } from 'src/utils/interface.utils';
import { Repository } from 'typeorm';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
  ) {}

  async addBadge(id: number, badge: IBadgeDetails): Promise<any> {
    const user = await this.profileRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(error?.userNotFound, HttpStatus.BAD_GATEWAY);
    }
    const addBadge = this.badgeRepository.create({
      ...badge,
      user_badges: user,
    });
    const saveBadge = await this.badgeRepository.save(addBadge);
    return saveBadge;
  }
}
