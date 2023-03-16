import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { addHealthData, getAllHealthDataForUser } from '../models/HealthDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { HealthData } from '../entities/healthData';

async function addHealthDataController(req: Request, res: Response): Promise<void> {
  const healthData = req.body as HealthData;

  try {
    const newHealthData = await addHealthData(healthData);
    res.status(201).json(newHealthData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAllUserHealthData(req: Request, res: Response): Promise<void> {
  const userId = parseInt(req.params.userId, 10);

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

async function deleteHealthData(req: Request, res: Response): Promise<void> {
  const { healthDataId } = req.params;

  try {
    // Check if health data exists
    const healthDataRepository = getRepository(HealthData);
    const healthData = await healthDataRepository.findOne({ where: { healthDataId } });
    if (!healthData) {
      res.sendStatus(404); // 404 not found
      return;
    }

    await healthDataRepository.delete(healthDataId);
    res.json({ message: 'Health data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete health data' });
  }
}

export { addHealthDataController, getAllUserHealthData, deleteHealthData };
