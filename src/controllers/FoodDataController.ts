import { Request, Response } from 'express'
import { addFoodData } from '../models/FoodDataModel';

async function submitFoodData(req: Request, res: Response): Promise<void> {
    const foodData = req.body as FoodData;
    
    const newFoodData = await addFoodData(foodData);
    console.log(newFoodData);

    res.sendStatus(201);
}

export { submitFoodData }