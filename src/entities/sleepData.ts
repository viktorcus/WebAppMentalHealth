import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class SleepData {
  @PrimaryGeneratedColumn('uuid')
  sleepDataId: string;

  @Column()
  userId: number;

  @Column()
  sleepDate: Date;

  @Column()
  hoursSlept: number;

  @Column()
  quality: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.sleepData, { cascade: ['insert', 'update'] })
  @JoinColumn()
  user: Relation<User>;
}
