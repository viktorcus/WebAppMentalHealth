import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './user'

@Entity()
export class ActivityData {

    @PrimaryGeneratedColumn()
    activityDataId: number;

    @ManyToOne(() => User, (user) => user.activities)
    @JoinColumn({ name: 'userId' })
    user: Relation<User>;

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