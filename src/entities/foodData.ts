import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user'

@Entity()
export class FoodData {

    @PrimaryGeneratedColumn()
    foodDataId: number;

    @ManyToOne(() => User, (user) => user.userId)
    userId: number;

    @CreateDateColumn()
    mealDate: Date;

    @Column()
    meal: string;

    @Column()
    calorieIntake: number;

    @Column()
    note: string;
}