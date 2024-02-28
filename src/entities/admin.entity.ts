import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  org: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  admin_Id: string;

  @Column({ type: 'text', nullable: false })
  admin_data: string;

  @CreateDateColumn({ select: true })
  created_at: Date;
 
  @UpdateDateColumn()
  updated_at: Date;
}
