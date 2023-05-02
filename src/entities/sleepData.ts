import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './user';

@Entity()
export class SleepData {
  @PrimaryGeneratedColumn('uuid')
  sleepDataId: string;

  @Column()
  sleepDate: Date;

  @Column()
  hoursSlept: number;

  @Column()
  quality: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.sleepData)
  user: Relation<User>;
}
