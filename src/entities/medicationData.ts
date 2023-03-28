import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './user';

@Entity()
export class MedicationData {
  @PrimaryGeneratedColumn('uuid')
  medicationDataId: string;

  @ManyToOne(() => User, (user) => user.medicationData)
  user: Relation<User>;

  @Column()
  userId: string;

  @Column()
  medicationName: string;

  @Column({ nullable: true })
  dosage: string;

  @Column({ nullable: true })
  frequency: string;

  @Column({ nullable: true })
  note: string;
}
