// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class UserWallet {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToMany(() => Organization, (organization) => organization.user, {
    cascade: true,
  })
  @JoinTable()

  organizations: Organization[];

  @CreateDateColumn({ select: true })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
// public bind(data: Partial<UserWallet>) {
//   if(data?.id) this.id = data.id;
//   if(data?.organizations) this.organizations = data.organizations;
//   return this;
// }
// }
