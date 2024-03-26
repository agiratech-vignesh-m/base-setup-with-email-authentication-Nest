// organization.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable } from 'typeorm';
import { UserWallet } from './user_wallet.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => UserWallet, user => user.organizations)
  user: UserWallet[];

  @Column({
    nullable: true
  })
  org_name: string;

  @Column(
    {
      nullable: true
    }
  )
  user_data: string;

  @CreateDateColumn({ select: true })
  created_at: Date;
 
  @UpdateDateColumn()
  updated_at: Date;
}
