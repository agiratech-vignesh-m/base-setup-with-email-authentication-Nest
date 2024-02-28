import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Badge } from './badge.entity';

@Entity({ name: 'user_profile' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  last_name: string;

  @Column({ type: "date", nullable: true })
  dob: Date;

  @Column()
  age: string;

  @Column()
  gender: string;

  @Column({ default: true, type: "boolean" })
  is_active: boolean;

  @Column({ nullable: true })
  profile_pic: string;

  @OneToOne(() => User, (user) => user.profile, {
    nullable: true,
  })
  user: User;

  @OneToMany(() => Badge, (badge) => badge.user_badges)
  // @JoinColumn()
  badges: Badge[]
  // UsersCoupons, (usersCoupons) => usersCoupons.driver)
  // usersCoupons: UsersCoupons[];

  @CreateDateColumn({ select: true })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
