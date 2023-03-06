import { Request, Response } from 'express';
import {
  addMedicalHistory,
  getMedicalHistoryById,
  getMedicalHistoryByUserId,
} from '../models/medicalHistoryModel';
import { parseDatabaseError } from '../utils/db-utils';
import { UserIdParam } from '../types/userInfo';
import { MedicalHistory } from '../entities/medicalHistory';

async function updateMedicalHistory(req: Request, res: Response): Promise<void> {
  const medicalHistory = req.body as MedicalHistory;

  try {
    const newMedicalHistory = await addMedicalHistory(medicalHistory);
    console.log(newMedicalHistory);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getMedicalHistory(req: Request, res: Response): Promise<void> {
  const { medicalHistoryId } = req.body as MedicalHistory;

  try {
    const medicalHistory = await getMedicalHistoryById(medicalHistoryId);
    console.log(medicalHistory);
    res.json(medicalHistory);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAllMedicalHistoryByUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;

  try {
    const allMedicalHistory = await getMedicalHistoryByUserId(userId);
    console.log(allMedicalHistory);
    res.json(allMedicalHistory);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { updateMedicalHistory, getMedicalHistory, getAllMedicalHistoryByUser };
