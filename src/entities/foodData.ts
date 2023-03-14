import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.js'

@Entity()
export class FoodData {

    @PrimaryGeneratedColumn()
    foodDataId: number;

    @ManyToOne(() => User, (user) => user.foods)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    mealDate: Date;

    @Column()
    meal: string;

    @Column({ nullable: true })
    calorieIntake: number;

    @Column( { nullable: true })
    note: string;
}