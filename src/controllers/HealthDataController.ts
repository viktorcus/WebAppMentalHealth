import { Request, Response } from 'express';
import {
  addHealthData,
  getAllHealthDataForUser,
  updateHealthData,
  deleteHealthData,
  getAllHealthDataById,
  generateHealthStats,
} from '../models/HealthDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { HealthData } from '../entities/healthData';
import { UserIdParam } from '../types/userInfo';
import { getUserById } from '../models/UserModel';

async function addHealthDataController(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const user = await getUserById(req.session.authenticatedUser.userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const healthData = req.body as HealthData;

  try {
    const newHealthData = await addHealthData(healthData, user);
    console.log(newHealthData);
    res.redirect(`/api/users/${userId}/health`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAllUserHealthData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const user = await getUserById(userId);
    const healthData = await getAllHealthDataForUser(userId);

    if (!healthData) {
      res.sendStatus(404); // 404 not found
      return;
    }

    res.render('healthData/healthPage', { user, healthData });
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
  const { isLoggedIn, authenticatedUser } = req.session;
  const newHealthData = req.body as HealthData;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const existingHealthData = await getAllHealthDataById(healthDataId);
    if (!existingHealthData) {
      res.sendStatus(404);
      return;
    }

    const healthData = await updateHealthData(healthDataId, newHealthData);
    console.log(healthData);
    res.redirect(`/api/users/${authenticatedUser.userId}/health`);
  } catch (error) {
    console.error(error);
    const databaseErrorMessage = parseDatabaseError(error);
    res.status(500).json({ databaseErrorMessage });
  }
}

async function deleteHealthDataController(req: Request, res: Response): Promise<void> {
  const { healthDataId } = req.params;
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const healthData = await getAllHealthDataById(healthDataId);
    if (!healthData) {
      res.sendStatus(404);
      return;
    }

    if (authenticatedUser.userId !== userId) {
      res.sendStatus(403);
      return;
    }

    await deleteHealthData(healthDataId);
    res.redirect(`/api/users/${userId}/health`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete health data' });
  }
}

async function renderHealthProgressPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  let { start, end, type } = req.body as HealthSearchParam;

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

  end = new Date();
  start = new Date();
  start.setMonth(end.getMonth() - 1);
  type = 'heartRate';

  const stats: HealthDataStats[] = await generateHealthStats(userId, start, end, type);

  res.render('healthData/healthStats', { user, stats, start, end, type });
}

async function updateHealthProgressPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  const { startStr, endStr, type } = req.body as HealthRefreshParam;

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

  const startPieces: number[] = startStr.split('-').map((s) => parseInt(s, 10));
  let start: Date = new Date(startPieces[0], startPieces[1] - 1, startPieces[2]);
  const endPieces: number[] = endStr.split('-').map((s) => parseInt(s, 10));
  const end: Date = new Date(endPieces[0], endPieces[1] - 1, endPieces[2]);

  if (start > end) {
    start = end;
    return;
  }

  const stats: HealthDataStats[] = await generateHealthStats(userId, start, end, type);
  res.render('healthData/healthStats', { user, stats, start, end, type });
}

async function getHealthStats(req: Request, res: Response): Promise<void> {
  const SearchTypeDictionary: { [key: string]: any } = {
    bmi: 'BMI',
    weight: 'Weight',
    bloodPressure: 'Blood Pressure',
    heartRate: 'Heart Rate',
  };

  let { start, end } = req.query as unknown as HealthSearchParam;
  const { type } = req.query as unknown as HealthSearchParam;

  if (!req.session.isLoggedIn) {
    // check that user is logged in
    res.redirect('/login');
    return;
  }

  if (!start && !end) {
    // default to one month
    end = new Date();
    start = new Date();
    start.setMonth(end.getMonth() - 1);
  }

  const searchType: string = SearchTypeDictionary[type];
  if (!start || !end || start > end || !searchType) {
    res.sendStatus(400); // invalid start/end times or search type
    return;
  }

  try {
    const stats: HealthDataStats[] = await generateHealthStats(
      req.session.authenticatedUser.userId,
      start,
      end,
      type
    );
    res.render('healthStats', { stats, type });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function renderCreateHealthPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  if (authenticatedUser.userId !== userId) {
    console.log(userId);
    res.sendStatus(403);
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.render('healthData/createHealth', { user });
}

async function renderUpdateHealthPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { healthDataId } = req.params;
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

  const healthData = await getAllHealthDataById(healthDataId);
  console.log(healthDataId);

  res.render('healthData/updateHealth', { user, healthData });
}

export {
  addHealthDataController,
  getAllUserHealthData,
  getHealthDataById,
  updateHealthDataController,
  deleteHealthDataController,
  getHealthStats,
  renderHealthProgressPage,
  updateHealthProgressPage,
  renderCreateHealthPage,
  renderUpdateHealthPage,
};
