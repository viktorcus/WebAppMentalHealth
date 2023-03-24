import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { HealthData } from './healthData';
import { SleepData } from './sleepData';
import { FoodData } from './foodData';
import { ActivityData } from './activityData';
import { Gender } from '../utils/enums';

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

  @CreateDateColumn()
  birthDate: Date;

  @Column()
  gender: Gender;

  @OneToMany(() => HealthData, (healthData) => healthData.user)
  healthData: Relation<HealthData[]>;

  @OneToMany(() => SleepData, (sleepData) => sleepData.user)
  sleepData: Relation<SleepData[]>;

  @Column()
  place: string;

  @OneToMany(() => ActivityData, (activity) => activity.user)
  activities: Relation<ActivityData>[];

  @OneToMany(() => FoodData, (food) => food.user)
  foods: Relation<FoodData>[];
}
