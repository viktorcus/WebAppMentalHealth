import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Gender } from '../types/userInfo';
import { MedicalHistory } from './medicalHistory';
import { MedicationData } from './medicationData';

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

  @OneToMany(() => MedicalHistory, (medicalHistory) => medicalHistory.user)
  medicalHistory: MedicalHistory[];

  @OneToMany(() => MedicationData, (medicationData) => medicationData.user)
  medicationData: MedicationData[];
}
