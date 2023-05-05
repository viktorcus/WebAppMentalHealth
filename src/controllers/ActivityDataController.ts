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
import { UserIdParam } from '../types/userInfo';

async function submitActivityData(req: Request, res: Response): Promise<void> {
  const activityData = req.body as ActivityData;
  activityData.startTime = new Date(activityData.startTime);
  activityData.endTime = new Date(activityData.endTime);

  if (activityData.startTime > activityData.endTime) {
    res.sendStatus(400); // invalid start/end times
    return;
  }
  // check that user is logged in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  // use session to add data for that user only
  const user = await getUserById(req.session.authenticatedUser.userId);
  try {
    if (user) {
      const activity = await addActivityData(activityData, user);
      if (activity) {
        res.status(201).redirect(`/users/${req.session.authenticatedUser.userId}/activity`);
      } else {
        res.sendStatus(500);
      }
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
    const activityData: ActivityEntity[] = (
      await getAllActivityDataForUser(req.session.authenticatedUser.userId)
    ).sort((a, b) => b.startTime.valueOf() - a.startTime.valueOf());
    res.render('activity/activityPage', { user, activityData });
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
  if (newActivity.startTime) {
    console.log(newActivity.startTime);
    newActivity.startTime = new Date(newActivity.startTime);
  }
  if (newActivity.endTime) {
    newActivity.endTime = new Date(newActivity.endTime);
  }

  if (!req.session.isLoggedIn) {
    // check that user is logged in
    res.redirect('/login');
    return;
  }

  try {
    const existingData = await getActivityDataById(activityDataId);
    if (!existingData) {
      // not found
      res.status(404).json({ message: `Activity data with ID ${activityDataId} not found` });
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
    res.redirect(`/users/${req.session.authenticatedUser.userId}/activity`);
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
    res.redirect(`/users/${req.session.authenticatedUser.userId}/activity`);
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
      keyword
    );
    res.json(activityData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getActivityStats(req: Request, res: Response): Promise<void> {
  let { start, end } = req.query as ActivitySearchParam;

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
    const stats: ActivityStats[] = await generateActivityStats(
      req.session.authenticatedUser.userId,
      start,
      end
    );
    res.render('activityStats', { stats });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function renderCreateActivityPage(req: Request, res: Response): Promise<void> {
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

  res.render('activity/createActivity', { user });
}

async function renderUpdateActivityPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { activityDataId } = req.params as unknown as ActivityDataIdParam;
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

  const activityData = await getActivityDataById(activityDataId);
  res.render('activity/updateActivity', { user, activityData });
}

async function renderActivityProgressPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  let { start, end } = req.body as ActivitySearchParam;

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

  const stats: ActivityStats[] = await generateActivityStats(userId, start, end);

  res.render('activity/activityStats', { user, stats, start, end });
}

async function updateActivityProgressPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  const { startStr, endStr } = req.body as ActivityRefreshParam;

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
  const start: Date = new Date(startPieces[0], startPieces[1] - 1, startPieces[2]);
  const endPieces: number[] = endStr.split('-').map((s) => parseInt(s, 10));
  const end: Date = new Date(endPieces[0], endPieces[1] - 1, endPieces[2]);

  if (start > end) {
    res.sendStatus(400); // invalid start/end times
    return;
  }

  const stats: ActivityStats[] = await generateActivityStats(userId, start, end);
  res.render('activity/activityStats', { user, stats, start, end });
}

export default {
  submitActivityData,
  getAllUserActivityData,
  getActivityData,
  updateActivityData,
  deleteActivityData,
  searchActivityData,
  getActivityStats,
  renderCreateActivityPage,
  renderUpdateActivityPage,
  renderActivityProgressPage,
  updateActivityProgressPage,
};
