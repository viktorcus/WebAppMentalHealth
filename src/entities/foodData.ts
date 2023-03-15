import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class FoodData {
  @PrimaryGeneratedColumn()
  foodDataId: number;

  @Column()
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
