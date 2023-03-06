import { Request, Response } from 'express'
import { addActivityData, getActivityDataById, getAllActivityDataForUser, updateActivityDataById } from '../models/ActivityDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { UserIdParam } from '../types/userInfo';

async function submitActivityData(req: Request, res: Response): Promise<void> {
    const foodData = req.body as ActivityData;
    
    try {
        const newActivity = await addActivityData(foodData);
        console.log(newActivity);
        res.sendStatus(201);
    } catch(err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

async function getAllUserActivityData(req: Request, res: Response): Promise<void> {
    const { userId } = req.params as unknown as UserIdParam;

    // include check for userid validity here once implemented

    try {
        const activityData = await getAllActivityDataForUser(userId);
        console.log(activityData);
        res.json(activityData);
    } catch(err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

async function getActivityData(req: Request, res: Response): Promise<void> {
    const { activityDataId } = req.params as unknown as ActivityDataIdParam;

    try {
        const activityData = await getActivityDataById(activityDataId);
        if(! activityData) {  // not found
            res.sendStatus(404);
        }
        console.log(activityData);
        res.json(activityData);
    } catch(err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

async function updateActivityData(req: Request, res: Response): Promise<void> {
    const { activityDataId } = req.params as unknown as ActivityDataIdParam;
    const newActivity = req.body as ActivityData;

    try {
        const activityData = await updateActivityDataById(activityDataId, newActivity);
        if(! activityData) {  // not found
            res.sendStatus(404);
        }
        console.log(activityData);
        res.json(activityData);
    } catch(err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

export default { 
    submitActivityData,
    getAllUserActivityData,
    getActivityData,
    updateActivityData,
}