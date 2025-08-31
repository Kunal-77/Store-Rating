import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Rating } from '../ratings/rating.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ length: 400 })
  address: string;

  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'owner_id' })   //  match DB column exactly
  owner: User;

  @OneToMany(() => Rating, (rating) => rating.store)
  ratings: Rating[];
}
