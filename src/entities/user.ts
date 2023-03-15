import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { Gender } from '../types/userInfo';
import { HealthData } from './healthData';
import { SleepData } from './sleepData';

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

  @Column()
  birthDate: Date;

  @Column()
  gender: Gender;

  @OneToMany(() => HealthData, (healthData) => healthData.user)
  healthData: Relation<HealthData[]>;

  @OneToMany(() => SleepData, (sleepData) => sleepData.user)
  sleepData: Relation<SleepData[]>;
}
