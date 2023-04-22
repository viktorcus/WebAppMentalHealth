import { Request, Response } from 'express';
import {
  addMedicationData,
  getMedicationDataById,
  getMedicationDataByUserId,
  updateMedicationDataById,
  medicationDataBelongsToUser,
  deleteMedicationDataById,
} from '../models/MedicationDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { UserIdParam } from '../types/userInfo';
import { MedicationData } from '../entities/medicationData';
import { getUserById } from '../models/UserModel';

async function addNewMedicationData(req: Request, res: Response): Promise<void> {
  const { authenticatedUser, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const medicationData = req.body as MedicationData;

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  try {
    const newMedicationData = await addMedicationData(medicationData);
    console.log(newMedicationData);
    res.redirect(`/medication/${newMedicationData.medicationDataId}`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getMedicationData(req: Request, res: Response): Promise<void> {
  const { medicationDataId } = req.body as MedicationData;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

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

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

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
    res.redirect('/login');
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

async function deleteMedicationData(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }

  const { medicationDataId } = req.params as MedicationDataIdParam;

  const medicationDataExists = await medicationDataBelongsToUser(
    medicationDataId,
    authenticatedUser.userId
  );
  if (!medicationDataExists) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  await deleteMedicationDataById(medicationDataId);

  res.sendStatus(204); // 204 No Content
}

export {
  addNewMedicationData,
  getMedicationData,
  getAllMedicationDataByUser,
  updateMedicationData,
  deleteMedicationData,
};
