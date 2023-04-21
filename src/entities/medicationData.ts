import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './user';

@Entity()
export class MedicationData {
  @PrimaryGeneratedColumn('uuid')
  medicationDataId: string;

  @Column()
  medicationName: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.medicationData, { cascade: ['insert', 'update'] })
  @JoinColumn()
  user: Relation<User>[];
}
