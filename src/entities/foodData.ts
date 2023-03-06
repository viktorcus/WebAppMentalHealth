import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user'

@Entity()
export class FoodData {

    @PrimaryGeneratedColumn()
    foodDataId: number;

    @ManyToOne(() => User, (user) => user.userId)
    userId: string;

    @CreateDateColumn()
    mealDate: Date;

    @Column()
    meal: string;

    @Column({ nullable: true })
    calorieIntake: number;

    @Column( { nullable: true })
    note: string;
}