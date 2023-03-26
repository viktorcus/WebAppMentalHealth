import { Request, Response } from 'express';
import {
  addMedicationData,
  getMedicationDataById,
  getMedicationDataByUserId,
} from '../models/MedicationDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { UserIdParam } from '../types/userInfo';
import { MedicationData } from '../entities/medicationData';

async function updateMedicationData(req: Request, res: Response): Promise<void> {
  const medicationData = req.body as MedicationData;

  try {
    const newMedicationData = await addMedicationData(medicationData);
    console.log(newMedicationData);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getMedicationData(req: Request, res: Response): Promise<void> {
  const { medicationDataId } = req.body as MedicationData;

  try {
    const medicationData = await getMedicationDataById(medicationDataId);
    console.log(medicationData);
    res.json(medicationData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAllMedicationDataByUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;

  try {
    const allMedicationData = await getMedicationDataByUserId(userId);
    console.log(allMedicationData);
    res.json(allMedicationData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { updateMedicationData, getMedicationData, getAllMedicationDataByUser };
