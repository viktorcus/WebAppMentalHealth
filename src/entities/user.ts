import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { Gender } from '../utils/enums';
import { MedicalHistory } from './medicalHistory';
import { MedicationData } from './medicationData';
import { HealthData } from './healthData';
import { SleepData } from './sleepData';
import { FoodData } from './foodData';
import { ActivityData } from './activityData';

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

  @Column({ nullable: true })
  birthday: Date;

  @Column({ default: Gender.Other })
  gender: Gender;

  @Column({ nullable: true })
  place: string;

  @OneToMany(() => MedicalHistory, (medicalHistory) => medicalHistory.user)
  medicalHistory: Relation<MedicalHistory>[];

  @OneToMany(() => MedicationData, (medicationData) => medicationData.user)
  medicationData: Relation<MedicationData>[];

  @OneToMany(() => HealthData, (healthData) => healthData.user)
  healthData: Relation<HealthData>[];

  @OneToMany(() => SleepData, (sleepData) => sleepData.user)
  sleepData: Relation<SleepData>[];

  @OneToMany(() => ActivityData, (activity) => activity.user)
  activities: Relation<ActivityData>[];

  @OneToMany(() => FoodData, (food) => food.user)
  foods: Relation<FoodData>[];
}
