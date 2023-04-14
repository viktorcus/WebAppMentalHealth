import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class MedicationData {
  @PrimaryGeneratedColumn('uuid')
  medicationDataId: string;

  @Column()
  medicationName: string;

  @Column({ nullable: true })
  dosage: string;

  @Column({ nullable: true })
  frequency: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.medicationData, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'userId' })
  user: User;
}
