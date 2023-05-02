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
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const medicationData = req.body as MedicationData;
  try {
    const newMedicationData = await addMedicationData(medicationData, user);
    const allMedicationData = await getMedicationDataByUserId(userId);
    console.log(newMedicationData);
    console.log(allMedicationData);
    res.redirect(`/api/users/${userId}/medication`);
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
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(userId);
  const allMedicationData = await getMedicationDataByUserId(userId);
  try {
    res.render('medicationData/medicationPage', { user, allMedicationData });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function updateMedicationData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
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
    res.redirect(`/api/users/${userId}/medication`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function deleteMedicationData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
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
  res.redirect(`/api/users/${userId}/medication`);
}

async function renderCreateMedicationPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  if (authenticatedUser.userId !== userId) {
    console.log(userId);
    res.sendStatus(403); // 403 forbidden
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.render('medicationData/createMedication', { user });
}

async function renderUpdateMedicationPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { medicationDataId } = req.params as MedicationDataIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  if (authenticatedUser.userId !== userId) {
    console.log(userId);
    res.sendStatus(403); // 403 forbidden
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const medicationData = await getMedicationDataById(medicationDataId);
  console.log(medicationDataId);

  res.render('medicationData/updateMedication', { user, medicationData });
}

async function renderCreateMedicationPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  if (authenticatedUser.userId !== userId) {
    console.log(userId);
    res.sendStatus(403); // 403 forbidden
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.render('medicationData/createMedication', { user });
}

async function renderUpdateMedicationPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { medicationDataId } = req.params as MedicationDataIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  if (authenticatedUser.userId !== userId) {
    console.log(userId);
    res.sendStatus(403); // 403 forbidden
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const medicationData = await getMedicationDataById(medicationDataId);
  console.log(medicationDataId);

  res.render('medicationData/updateMedication', { user, medicationData });
}

export {
  addNewMedicationData,
  getMedicationData,
  getAllMedicationDataByUser,
  updateMedicationData,
  deleteMedicationData,
  renderCreateMedicationPage,
  renderUpdateMedicationPage,
};
