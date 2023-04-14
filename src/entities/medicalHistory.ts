import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.medicalHistory, { cascade: ['insert', 'update'] })
  @JoinColumn()
  users: Relation<User>[];
}
