import { Request, Response } from 'express';
import {
  addHealthData,
  getAllHealthDataForUser,
  updateHealthData,
  deleteHealthData,
  getAllHealthDataById,
} from '../models/HealthDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { HealthData } from '../entities/healthData';
import { UserIdParam } from '../types/userInfo';

async function addHealthDataController(req: Request, res: Response): Promise<void> {
  const healthData = req.body as HealthData;

  try {
    const newHealthData = await addHealthData(healthData);
    console.log(newHealthData);
    res.status(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAllUserHealthData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  // const userId = parseInt(req.params.userId, 10);

  try {
    const healthData = await getAllHealthDataForUser(userId);

    if (!healthData) {
      res.sendStatus(404); // 404 not found
      return;
    }

    res.json(healthData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getHealthDataById(req: Request, res: Response): Promise<void> {
  const { healthDataId } = req.body as HealthData;

  try {
    const healthData = await getAllHealthDataById(healthDataId);
    console.log(healthData);
    res.json(healthData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function updateHealthDataController(req: Request, res: Response): Promise<void | null> {
  const { healthDataId } = req.params;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const healthData = req.body as HealthData;
    const updatedSleepData = await updateHealthData(healthDataId, healthData);
    console.log(updatedSleepData);
    res.status(200).json(updatedSleepData);
  } catch (error) {
    console.error(error);
    const databaseErrorMessage = parseDatabaseError(error);
    res.status(500).json({ databaseErrorMessage });
  }
}

async function deleteHealthDataController(req: Request, res: Response): Promise<void> {
  const { healthDataId } = req.params;
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    await deleteHealthData(healthDataId);
    res.json({ message: 'Health data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete health data' });
  }
}

export {
  addHealthDataController,
  getAllUserHealthData,
  getHealthDataById,
  updateHealthDataController,
  deleteHealthDataController,
};
