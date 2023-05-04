import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './user';

@Entity()
export class MedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  medicalHistoryId: string;

  @Column()
  conditionName: string;

  @Column()
  treatment: string;

  @Column()
  diagnosisDate: Date;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.medicalHistories, { cascade: ['insert', 'update'] })
  user: Relation<User>;
}
