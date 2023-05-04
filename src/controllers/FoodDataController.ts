import { Request, Response } from 'express';
import {
  addFoodData,
  getAllFoodDataForUser,
  getFoodDataById,
  updateFoodDataById,
  deleteFoodDataById,
  getFoodDataBySearch,
  generateFoodStats,
} from '../models/FoodDataModel';
import { parseDatabaseError } from '../utils/db-utils';
import { FoodData as FoodEntity } from '../entities/foodData';
import { getUserById } from '../models/UserModel';
import { UserIdParam } from '../types/userInfo';

async function submitFoodData(req: Request, res: Response): Promise<void> {
  const foodData = req.body as FoodData;

  // check that user is logged in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  // use session to add data for that user only
  const user = await getUserById(req.session.authenticatedUser.userId);
  try {
    if (user) {
      const food = await addFoodData(foodData, user);
      if (food) {
        res.status(201).redirect(`/users/${req.session.authenticatedUser.userId}/food`);
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

async function getAllUserFoodData(req: Request, res: Response): Promise<void> {
  // check that user is logged in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const user = await getUserById(req.session.authenticatedUser.userId);
    const foodData = await getAllFoodDataForUser(req.session.authenticatedUser.userId);
    res.render('food/foodPage', { user, foodData });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getFoodData(req: Request, res: Response): Promise<void> {
  const { foodDataId } = req.params as unknown as FoodDataIdParam;

  // check that user is logged in
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
    return;
  }

  try {
    const foodData = await getFoodDataById(foodDataId);
    if (!foodData) {
      // not found
      res.sendStatus(404);
      return;
    }
    // check that this fooddata item belongs to this user
    if (!(foodData?.user.userId === req.session.authenticatedUser.userId)) {
      res.sendStatus(403);
      return;
    }
    res.json(foodData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function updateFoodData(req: Request, res: Response): Promise<void> {
  const { foodDataId } = req.params as unknown as FoodDataIdParam;
  const newFood = req.body as FoodData;

  if (!req.session.isLoggedIn) {
    // check that user is logged in
    res.redirect('/login');
    return;
  }

  try {
    const existingData = await getFoodDataById(foodDataId);
    if (!existingData) {
      // not found
      res.sendStatus(404);
      return;
    }
    // check that this fooddata item belongs to this user
    if (!(existingData?.user.userId === req.session.authenticatedUser.userId)) {
      res.sendStatus(403);
      return;
    }

    const foodData = await updateFoodDataById(foodDataId, newFood);
    if (!foodData) {
      // not found
      res.sendStatus(404);
      return;
    }
    console.log(foodData);
    res.redirect(`/users/${req.session.authenticatedUser.userId}/food`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function deleteFoodData(req: Request, res: Response): Promise<void> {
  const { foodDataId } = req.params as unknown as FoodDataIdParam;

  if (!req.session.isLoggedIn) {
    // check that user is logged in
    res.sendStatus(401);
    return;
  }

  try {
    const foodData = await getFoodDataById(foodDataId);
    if (!foodData) {
      // not found
      res.sendStatus(404);
      return;
    }
    // check that this fooddata item belongs to this user
    if (!(foodData?.user.userId === req.session.authenticatedUser.userId)) {
      res.sendStatus(403);
      return;
    }

    await deleteFoodDataById(foodDataId);
    res.redirect(`/users/${req.session.authenticatedUser.userId}/food`);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function searchFoodData(req: Request, res: Response): Promise<void> {
  const { start, end, keyword } = req.query as FoodSearchParam;

  // check that user is logged in
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  if (start && end && start > end) {
    res.sendStatus(400); // invalid start/end times
    return;
  }

  try {
    const foodData: FoodEntity[] = await getFoodDataBySearch(
      req.session.authenticatedUser.userId,
      start,
      end,
      keyword
    );
    res.json(foodData);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getFoodStats(req: Request, res: Response): Promise<void> {
  let { start, end } = req.query as FoodSearchParam;

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
    const stats: FoodStats[] = await generateFoodStats(
      req.session.authenticatedUser.userId,
      start,
      end
    );
    res.render('foodStats', { stats });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function renderCreateFoodPage(req: Request, res: Response): Promise<void> {
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

  res.render('food/createFood', { user });
}

async function renderUpdateFoodPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { foodDataId } = req.params as unknown as FoodDataIdParam;
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

  const foodData = await getFoodDataById(foodDataId);
  console.log(foodDataId);

  res.render('food/updateFood', { user, foodData });
}

async function renderFoodProgressPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  let { start, end } = req.body as FoodSearchParam;

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

  const stats: FoodStats[] = await generateFoodStats(userId, start, end);

  res.render('food/foodStats', { user, stats, start, end });
}

async function updateFoodProgressPage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;
  const { startStr, endStr } = req.body as FoodRefreshParam;

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

  const stats: FoodStats[] = await generateFoodStats(userId, start, end);
  res.render('food/foodStats', { user, stats, start, end });
}

export default {
  submitFoodData,
  getAllUserFoodData,
  getFoodData,
  updateFoodData,
  deleteFoodData,
  searchFoodData,
  getFoodStats,
  renderCreateFoodPage,
  renderUpdateFoodPage,
  renderFoodProgressPage,
  updateFoodProgressPage,
};
