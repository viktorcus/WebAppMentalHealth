import { Request, Response } from 'express';
import {
  addMedicationData,
  getMedicationDataById,
  getMedicationDataByUserId,
  updateMedicationDataById,
} from '../models/MedicationDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { UserIdParam } from '../types/userInfo';
import { MedicationData } from '../entities/medicationData';

async function addNewMedicationData(req: Request, res: Response): Promise<void> {
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

async function updateMedicationData(req: Request, res: Response): Promise<void> {
  const { medicationDataId } = req.params as MedicationDataIdParam;
  const updatedMedicationData = req.body as Partial<MedicationData>;

  if (!req.session.isLoggedIn) {
    res.sendStatus(403); // if user did not log in, access is forbidden
    return;
  }

  try {
    const existingMedicationData = await getMedicationDataById(medicationDataId);

    if (!existingMedicationData) {
      res.status(404).json({ message: `Medication data with ID ${medicationDataId} not found` });
      return;
    }

    const mergedMedicationData = { ...existingMedicationData, ...updatedMedicationData };
    await updateMedicationDataById(medicationDataId, mergedMedicationData);

    const updatedData = await getMedicationDataById(medicationDataId);
    console.log(updatedData);
    res.json(updatedData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export {
  addNewMedicationData,
  getMedicationData,
  getAllMedicationDataByUser,
  updateMedicationData,
};
