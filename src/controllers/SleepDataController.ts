import { Request, Response } from 'express';
import {
  addSleepData,
  getAllSleepDataForUser,
  generateSleepStats,
  getSleepDataById,
  updateSleepData,
  deleteSleepData,
  getSleepDataByDateRange,
} from '../models/SleepDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { getUserById } from '../models/UserModel';
import { UserIdParam } from '../types/userInfo';
import { SleepData } from '../entities/sleepData';

async function addNewSleepData(req: Request, res: Response): Promise<void> {
  const { authenticatedUser, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const sleepData = req.body as SleepData;

  const user = await getUserById(authenticatedUser.userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }
  try {
    if (user) {
      const newSleepData = await addSleepData(sleepData, user);
      res.redirect(`/sleep/${newSleepData.sleepDataId}`);
    }
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAllSleepDataByUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  // const userId = parseInt(req.params.userId, 10);

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const sleepData = await getAllSleepDataForUser(userId);
    console.log(sleepData);
    res.status(200).json(sleepData);
  } catch (error) {
    console.error(error);
    const databaseErrorMessage = parseDatabaseError(error);
    res.status(500).json({ databaseErrorMessage });
  }
}

async function getSleepData(req: Request, res: Response): Promise<void> {
  const { sleepDataId } = req.body as SleepData;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const sleepData = await getSleepDataById(sleepDataId);
    console.log(sleepData);
    res.json(sleepData);
  } catch (error) {
    console.error(error);
    const databaseErrorMessage = parseDatabaseError(error);
    res.status(500).json({ databaseErrorMessage });
  }
}

async function updateSleepDataById(req: Request, res: Response): Promise<void> {
  const { sleepDataId } = req.params;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const sleepData = req.body as SleepData;
    const updatedSleepData = await updateSleepData(sleepDataId, sleepData);
    console.log(updatedSleepData);
    res.status(200).json(updatedSleepData);
  } catch (error) {
    console.error(error);
    const databaseErrorMessage = parseDatabaseError(error);
    res.status(500).json({ databaseErrorMessage });
  }
}

async function deleteSleepDataById(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.redirect('/login');
    return;
  }

  const { sleepData } = req.params;

  try {
    // const sleepData = req.body;
    await deleteSleepData(sleepData);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    const databaseErrorMessage = parseDatabaseError(error);
    res.status(500).json({ databaseErrorMessage });
  }
}

async function getSleepDataByDateRangeFromDb(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const userId = req.body;
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    const sleepData = await getSleepDataByDateRange(userId, startDate, endDate);
    res.status(200).json(sleepData);
  } catch (error) {
    console.error(error);
    const databaseErrorMessage = parseDatabaseError(error);
    res.status(500).json({ databaseErrorMessage });
  }
}

async function getSleepStats(req: Request, res: Response): Promise<void> {
  let { start, end } = req.query as unknown as SleepSearchParam;

  if (!req.session.isLoggedIn) {
    // check that user is logged in
    res.redirect('/login');
    return;
  }

  if (!start && !end) {
    end = new Date();
    start = new Date();
    start.setMonth(end.getMonth() - 1);
  }

  if (!start || !end || start > end) {
    res.sendStatus(400); // invalid start/end times
    return;
  }
  try {
    const stats: SleepDataStats[] = await generateSleepStats(
      req.session.authenticatedUser.userId,
      start,
      end
    );
    console.log(stats);
    res.render('sleepStats', { stats });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function renderSleepProgressPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  let { start, end } = req.body as SleepSearchParam;

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

  if (!start && !end) {
    end = new Date();
    start = new Date();
    start.setMonth(end.getMonth() - 1);
  }

  if (!start || !end || start > end) {
    res.sendStatus(400); // invalid start/end times
    return;
  }

  const stats: SleepDataStats[] = await generateSleepStats(userId, start, end);

  res.render('sleep/sleepStats', { user, stats, start, end });
}

async function updateSleepProgressPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  const { startStr, endStr } = req.body as SleepRefreshParam;

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

  const stats: SleepDataStats[] = await generateSleepStats(userId, start, end);
  res.render('sleep/sleepStats', { user, stats, start, end });
}

export {
  addNewSleepData,
  getAllSleepDataByUser,
  getSleepData,
  updateSleepDataById,
  deleteSleepDataById,
  getSleepDataByDateRangeFromDb,
  getSleepStats,
  renderSleepProgressPage,
  updateSleepProgressPage,
};
