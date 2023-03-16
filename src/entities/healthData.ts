import { Entity, PrimaryGeneratedColumn, Column, Relation, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class HealthData {
  @PrimaryGeneratedColumn('uuid')
  healthDataId: string;

  @Column()
  measurementDate: Date;

  @Column()
  userId: number;

  @Column()
  weight: number;

  @Column()
  height: number;

  @Column()
  bmi: number;

  @Column()
  heartRate: number;

  @Column()
  bloodPressureSystolic: number;

  @Column()
  bloodPressureDiastolic: number;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.healthData)
  user: Relation<User>;
}
