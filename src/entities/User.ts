import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Gender } from '../types/userInfo';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column()
  birthday: Date;

  @Column({ default: Gender.Other })
  gender: Gender;

  @Column({ nullable: true })
  place: string;
}
