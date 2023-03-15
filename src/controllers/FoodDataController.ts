import { Request, Response } from 'express'
import { addFoodData, getAllFoodDataForUser, getFoodDataById, updateFoodDataById, deleteFoodDataById } from '../models/FoodDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { UserIdParam } from '../types/userInfo';

async function submitFoodData(req: Request, res: Response): Promise<void> {
    const foodData = req.body as FoodData;
    
    try {
        await addFoodData(foodData);
        res.sendStatus(201);
    } catch(err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

async function getAllUserFoodData(req: Request, res: Response): Promise<void> {
    const { userId } = req.params as unknown as UserIdParam;

    // include check for userid validity here once implemented

    try {
        const foodData = await getAllFoodDataForUser(userId);
        console.log(foodData);
        res.json(foodData);
    } catch(err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

async function getFoodData(req: Request, res: Response): Promise<void> {
    const { foodDataId } = req.params as unknown as FoodDataIdParam;

    try {
        const foodData = await getFoodDataById(foodDataId);
        if(! foodData) {  // not found
            res.sendStatus(404);
            return;
        }
        console.log(foodData);
        res.json(foodData);
    } catch(err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

async function updateFoodData(req: Request, res: Response): Promise<void> {
    const { foodDataId } = req.params as unknown as FoodDataIdParam;
    const newFood = req.body as FoodData;

    try {
        const foodData = await updateFoodDataById(foodDataId, newFood);
        if(! foodData) {  // not found
            res.sendStatus(404);
            return;
        }
        console.log(foodData);
        res.json(foodData);
    } catch(err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

async function deleteFoodData(req: Request, res: Response): Promise<void> {
    const { foodDataId } = req.params as unknown as FoodDataIdParam;

    try {
        await deleteFoodDataById(foodDataId);
        res.sendStatus(200);
    } catch(err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

export default { 
    submitFoodData,
    getAllUserFoodData,
    getFoodData,
    updateFoodData,
    deleteFoodData,
}