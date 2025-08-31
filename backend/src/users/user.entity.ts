import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/rating.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude() // hide password when returning user object
  @Column()
  password: string;

  @Column({ length: 400 })
  address: string;

  @Column({ type: 'enum', enum: ['ADMIN', 'USER', 'OWNER'], default: 'USER' })
  role: string;

  //  A user can submit many ratings
  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  //  A user (owner) can own many stores
  @OneToMany(() => Store, (store) => store.owner)
  stores: Store[];
}
