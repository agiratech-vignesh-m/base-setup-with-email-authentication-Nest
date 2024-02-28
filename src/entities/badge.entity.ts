import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity({name: 'badge'})
export class Badge {
  @PrimaryGeneratedColumn("uuid")
  id: string;
 
  @Column({ nullable: false })
  name: string;
 
  @Column({ nullable: true })
  image: string;
 
  @ManyToOne(() => Profile, (profile) => profile.badges)
  user_badges: Profile;
 
  @CreateDateColumn()
  created_at: Date;
 
  @UpdateDateColumn()
  updated_at: Date;

}