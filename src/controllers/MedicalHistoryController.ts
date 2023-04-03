import { Request, Response } from 'express';
import {
  addMedicalHistory,
  getMedicalHistoryById,
  getMedicalHistoryByUserId,
  updateMedicalHistoryDataById,
} from '../models/MedicalHistoryModel';
import { parseDatabaseError } from '../utils/db-utils';
import { UserIdParam } from '../types/userInfo';
import { MedicalHistory } from '../entities/medicalHistory';

async function addNewMedicalHistory(req: Request, res: Response): Promise<void> {
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

async function updateMedicalHistory(req: Request, res: Response): Promise<void> {
  const { medicalHistoryId } = req.params as MedicalHistoryIdParam;
  const updatedMedicalHistory = req.body as Partial<MedicalHistory>;

  if (!req.session.isLoggedIn) {
    res.sendStatus(403); // if user did not log in, access is forbidden
    return;
  }

  try {
    const existingMedicalHistory = await getMedicalHistoryById(medicalHistoryId);

    if (!existingMedicalHistory) {
      res.status(404).json({ message: `Medical history with ID ${medicalHistoryId} not found` });
      return;
    }

    const mergedMedicalHistory = { ...existingMedicalHistory, ...updatedMedicalHistory };
    await updateMedicalHistoryDataById(medicalHistoryId, mergedMedicalHistory);

    const updatedData = await getMedicalHistoryById(medicalHistoryId);
    console.log(updatedData);
    res.json(updatedData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export {
  addNewMedicalHistory,
  getMedicalHistory,
  getAllMedicalHistoryByUser,
  updateMedicalHistory,
};
