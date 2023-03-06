import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user'

@Entity()
export class ActivityData {

    @PrimaryGeneratedColumn()
    activityDataId: number;

    @ManyToOne(() => User, (user) => user.userId)
    userId: string;

    @Column()
    activityType: string;

    @CreateDateColumn({ default: new Date() })
    date: Date;

    @CreateDateColumn()
    startTime: Date;

    @CreateDateColumn()
    endTime: Date;

    @Column({ nullable: true })
    caloriesBurned: number;

    @Column({ nullable: true })
    note: string;
}