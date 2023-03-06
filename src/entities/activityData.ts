import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user'

@Entity()
export class ActivityData {

    @PrimaryGeneratedColumn()
    activityDataId: number;

    @ManyToOne(() => User, (user) => user.userId)
    userId: number;

    @Column()
    activityType: string;

    @CreateDateColumn({ default: new Date() })
    date: Date;

    @CreateDateColumn()
    startTime: Date;

    @CreateDateColumn()
    endTime: Date;

    @Column()
    caloriesBurned: number;

    @Column()
    note: string;
}