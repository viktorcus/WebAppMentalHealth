import { Request, Response } from 'express';
import { addSleepData, getAllSleepDataForUser, generateSleepStats } from '../models/SleepDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { SleepData } from '../entities/sleepData';
import { getUserById } from '../models/UserModel';

async function addSleepDataController(req: Request, res: Response): Promise<void> {
  const sleepData = req.body as SleepData;

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  // use session to add data for that user only
  const user = await getUserById(req.session.authenticatedUser.userId);
  try {
    if (user) {
      const newSleepData = await addSleepData(sleepData, user);
      res.status(201).json(newSleepData);
    }
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAllUserSleepData(req: Request, res: Response): Promise<void> {
  const userId = parseInt(req.params.userId, 10);

  try {
    const sleepData = await getAllSleepDataForUser(userId);

    if (!sleepData) {
      res.sendStatus(404); // 404 not found
      return;
    }

    res.json(sleepData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
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
      end,
    );
    console.log(stats);
    res.render('sleepStats', { stats });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export { addSleepDataController, getAllUserSleepData, addSleepData, getSleepStats };
