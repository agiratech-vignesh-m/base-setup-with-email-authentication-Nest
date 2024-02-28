import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create_profile.dto';
import { MailService } from '../mail/mail.service';
import { Profile } from 'src/entities/profile.entity';
import { error } from 'src/config/yaml.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly email: MailService,
  ) {}

  async createProfile(req: User, data: CreateProfileDto) {
    try {
      let query : any = {}
      query.id = req.id
      console.log("Query", query)
      const user = await this.userRepository.findOne({
        where: query,
      });

      if (!user) {
        throw new HttpException(error?.userNotFound, HttpStatus.BAD_REQUEST);
      }
      const newProfile = await this.profileRepository.save(data)
      if(!newProfile){
        throw new HttpException(error.standardError, HttpStatus.BAD_REQUEST);
      }
      user.profile = newProfile;
      return this.userRepository.save(user);      
    } catch (error) {
      console.log('Error', error);
      throw new Error(error.response);
    }
  }
  
  async getProfile(id: number): Promise<any> {

    let query: any = {};
    query.id = id;

    const user = await this.profileRepository.findOne({
      where: query,
      relations: ['user', 'badges']
    });

    return user
  }
}
