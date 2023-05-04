import { Request, Response } from 'express';
import {
  addMedicalHistory,
  getMedicalHistoryById,
  getMedicalHistoryByUserId,
  updateMedicalHistoryDataById,
  medicalHistoryBelongsToUser,
  deleteMedicalHistoryById,
} from '../models/MedicalHistoryModel';
import { parseDatabaseError } from '../utils/db-utils';
import { UserIdParam } from '../types/userInfo';
import { MedicalHistory } from '../entities/medicalHistory';
import { getUserById } from '../models/UserModel';

async function addNewMedicalHistory(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { authenticatedUser, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const medicalHistory = req.body as MedicalHistory;
  try {
    const newMedicalHistory = await addMedicalHistory(medicalHistory, user);
    console.log(newMedicalHistory);
    res.redirect(`/api/users/${userId}/medicalHistory`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getMedicalHistory(req: Request, res: Response): Promise<void> {
  const { medicalHistoryId } = req.body as MedicalHistory;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

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
  const { isLoggedIn } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(userId);
  const allMedicalHistories = await getMedicalHistoryByUserId(userId);
  try {
    res.render('medicalHistory/medicalHistoryPage', { user, allMedicalHistories });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function updateMedicalHistory(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { medicalHistoryId } = req.params as MedicalHistoryIdParam;
  const updatedMedicalHistory = req.body as Partial<MedicalHistory>;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
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
    res.redirect(`/api/users/${userId}/medicalHistory`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function deleteMedicalHistory(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const { medicalHistoryId } = req.params as MedicalHistoryIdParam;

  const medicalHistoryExists = await medicalHistoryBelongsToUser(
    medicalHistoryId,
    authenticatedUser.userId
  );
  if (!medicalHistoryExists) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  await deleteMedicalHistoryById(medicalHistoryId);

  res.redirect(`/api/users/${userId}/medicalHistory`);
}

async function renderCreateMedicalHistoryPage(req: Request, res: Response): Promise<void> {
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

  res.render('medicalHistory/createMedicalHistory', { user });
}

async function renderUpdateMedicalHistoryPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { medicalHistoryId } = req.params as MedicalHistoryIdParam;
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

  const medicalHistory = await getMedicalHistoryById(medicalHistoryId);

  res.render('medicalHistory/updateMedicalHistory', { user, medicalHistory });
}

export {
  addNewMedicalHistory,
  getMedicalHistory,
  getAllMedicalHistoryByUser,
  updateMedicalHistory,
  deleteMedicalHistory,
  renderCreateMedicalHistoryPage,
  renderUpdateMedicalHistoryPage,
};
