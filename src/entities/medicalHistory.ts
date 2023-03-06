import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class MedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  medicalHistoryId: string;

  @ManyToOne(() => User, (user) => user.medicalHistory)
  user: User;

  @Column()
  conditionName: string;

  @Column()
  treatment: string;

  @Column()
  diagnosisDate: Date;

  @Column({ nullable: true })
  note: string;
}
