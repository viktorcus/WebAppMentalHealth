import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.js'

@Entity()
export class ActivityData {

    @PrimaryGeneratedColumn()
    activityDataId: number;

    @ManyToOne(() => User, (user) => user.activities)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    activityType: string;

    @CreateDateColumn()
    startTime: Date;

    @CreateDateColumn()
    endTime: Date;

    @Column({ nullable: true })
    caloriesBurned: number;

    @Column({ nullable: true })
    note: string;
}