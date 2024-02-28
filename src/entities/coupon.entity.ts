
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   ObjectId,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm";
// import { Organisation } from "./organisation.entity";
// import { User } from "./user.entity";
 
// @Entity()
// export class Coupon {
//   @PrimaryGeneratedColumn("uuid")
//   id: ObjectId;
 
//   @Column({ type: "varchar", nullable: false })
//   coupon_id: string;
 
//   @Column({ type: "varchar", nullable: false })
//   image: string;
 
//   @Column({ type: "varchar", nullable: false })
//   image_name: string;
 
//   @Column({ type: "varchar", nullable: false })
//   description: string;
 
//   @Column({ type: "date", nullable: false })
//   start_date: Date;
 
//   @Column({ type: "date", nullable: false })
//   end_date: Date;
 
//   @Column({ type: "enum", enum: StatusEnum, default: StatusEnum.PENDING })
//   status: StatusEnum;
  
//   @Column({ type: "boolean", default: true })
//   is_active: boolean;
 
//   @OneToMany(() => UsersCoupons, (usersCoupons) => usersCoupons.coupon)
//   usersCoupons: UsersCoupons[];
 
//   @ManyToOne(() => Organisation, (organisation) => organisation.coupons)
//   tenant: Organisation;
 
//   @ManyToOne(() => User)
//   @JoinColumn()
//   created_by: User;
 
//   @CreateDateColumn()
//   created_at: Date;
 
//   @UpdateDateColumn()
//   updated_at: Date;
// }
 