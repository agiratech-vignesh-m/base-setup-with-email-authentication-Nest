import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  mobile_number: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ nullable: true })
  password_reset_hash: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  email_verification_token: string;

  @Column({ nullable: true, type: "timestamp" })
  email_expiry_time: Date;

  @Column({ nullable: true, type: "timestamp" })
  otp_expiry_time: Date;

  @Column({ nullable: false, default: false, type: 'boolean' })
  mobile_verified: boolean;

  @Column({ nullable: false, default: false, type: 'boolean' })
  email_verified: boolean;

  @OneToOne(() => Profile, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn({ select: true })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
