import { Request, Response } from 'express';
import { addActivityData, getAllActivityDataForUser } from '../models/ActivityDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { UserIdParam } from '../types/userInfo';

async function submitActivityData(req: Request, res: Response): Promise<void> {
  const foodData = req.body as ActivityData;

  try {
    const newActivity = await addActivityData(foodData);
    console.log(newActivity);
    res.sendStatus(201);
  } catch (err) {
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
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { submitActivityData, getAllUserActivityData };
