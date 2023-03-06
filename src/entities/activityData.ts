import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ActivityData {

    @PrimaryGeneratedColumn()
    activityDataId: number;

    @Column()
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