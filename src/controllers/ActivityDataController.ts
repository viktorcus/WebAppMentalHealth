import { Request, Response } from 'express';
import {
  addActivityData,
  getActivityDataById,
  getAllActivityDataForUser,
  updateActivityDataById,
  deleteActivityDataById,
  getActivityDataBySearch,
  generateActivityStats,
} from '../models/ActivityDataModel';
import { getUserById } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import { ActivityData as ActivityEntity } from '../entities/activityData';

async function submitActivityData(req: Request, res: Response): Promise<void> {
  const activityData = req.body as ActivityData;

  if (activityData.startTime > activityData.endTime) {
    res.sendStatus(400); // invalid start/end times
    return;
  }
  // check that user is logged in
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // use session to add data for that user only
  const user = await getUserById(req.session.authenticatedUser.userId);
  try {
    if (user) {
      const activity = await addActivityData(activityData, user);
      res.status(201).json(activity);
    }
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAllUserActivityData(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }
  const user = await getUserById(req.session.authenticatedUser.userId);

  try {
    const activityData = await getAllActivityDataForUser(req.session.authenticatedUser.userId);
    res.render('activityPage', { user, activityData });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getActivityData(req: Request, res: Response): Promise<void> {
  const { activityDataId } = req.params as unknown as ActivityDataIdParam;

  // check that user is logged in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const activityData = await getActivityDataById(activityDataId);
    if (!activityData) {
      // not found
      res.sendStatus(404);
      return;
    }
    // check that this activityData item belongs to this user
    if (!(activityData?.user.userId === req.session.authenticatedUser.userId)) {
      res.sendStatus(403);
      return;
    }
    res.json(activityData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function updateActivityData(req: Request, res: Response): Promise<void> {
  const { activityDataId } = req.params as unknown as ActivityDataIdParam;
  const newActivity = req.body as ActivityData;

  if (!req.session.isLoggedIn) {
    // check that user is logged in
    res.sendStatus(401);
    return;
  }

  try {
    const existingData = await getActivityDataById(activityDataId);
    if (!existingData) {
      // not found
      res.sendStatus(404);
      return;
    }
    // check that this activitydata item belongs to this user
    if (!(existingData?.user.userId === req.session.authenticatedUser.userId)) {
      res.sendStatus(403);
      return;
    }

    const activityData = await updateActivityDataById(activityDataId, newActivity);
    if (!activityData) {
      // not found
      res.sendStatus(404);
      return;
    }
    console.log(activityData);
    res.json(activityData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function deleteActivityData(req: Request, res: Response): Promise<void> {
  const { activityDataId } = req.params as unknown as ActivityDataIdParam;

  if (!req.session.isLoggedIn) {
    // check that user is logged in
    res.sendStatus(401);
    return;
  }

  try {
    const activityData = await getActivityDataById(activityDataId);
    if (!activityData) {
      // not found
      res.sendStatus(404);
      return;
    }
    // check that this fooddata item belongs to this user
    if (!(activityData?.user.userId === req.session.authenticatedUser.userId)) {
      res.sendStatus(403);
      return;
    }

    await deleteActivityDataById(activityDataId);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function searchActivityData(req: Request, res: Response): Promise<void> {
  const { start, end, keyword } = req.query as ActivitySearchParam;

  if (start && end && start > end) {
    res.sendStatus(400); // invalid start/end times
    return;
  }

  try {
    const activityData: ActivityEntity[] = await getActivityDataBySearch(
      req.session.authenticatedUser.userId,
      start,
      end,
      keyword,
    );
    res.json(activityData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getActivityStats(req: Request, res: Response): Promise<void> {
  const { start, end } = req.query as ActivitySearchParam;
  if (!start || !end || start > end) {
    res.sendStatus(400); // invalid start/end times
    return;
  }
  try {
    const stats: ActivityStats[] = await generateActivityStats(
      req.session.authenticatedUser.userId,
      start,
      end,
    );
    res.json(stats);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export default {
  submitActivityData,
  getAllUserActivityData,
  getActivityData,
  updateActivityData,
  deleteActivityData,
  searchActivityData,
  getActivityStats,
};
