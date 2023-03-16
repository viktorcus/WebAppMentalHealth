import { Request, Response } from 'express';
import { addSleepData, getAllSleepDataForUser } from '../models/SleepDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { SleepData } from '../entities/sleepData';

async function addSleepDataController(req: Request, res: Response): Promise<void> {
  const sleepData = req.body as SleepData;

  try {
    const newSleepData = await addSleepData(sleepData);
    res.status(201).json(newSleepData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAllUserSleepData(req: Request, res: Response): Promise<void> {
  const userId = parseInt(req.params.userId, 10);

  try {
    const sleepData = await getAllSleepDataForUser(userId);

    if (!sleepData) {
      res.sendStatus(404); // 404 not found
      return;
    }

    res.json(sleepData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { addSleepDataController, getAllUserSleepData, addSleepData };
