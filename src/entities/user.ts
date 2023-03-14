import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Relation } from 'typeorm';
import { FoodData } from './foodData.js'
import { ActivityData } from './activityData.js';
import { Gender } from '../utils/enums.js';


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column()
    userName: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    passwordHash: string;

    @CreateDateColumn()
    birthdate: Date;

    @Column()
    gender: Gender;

    @Column()
    place: string;

    @OneToMany(() => ActivityData, (activity) => activity.user)
    activities: Relation<ActivityData>[];

    @OneToMany(() => FoodData, (food) => food.user)
    foods: Relation<FoodData>[];
}