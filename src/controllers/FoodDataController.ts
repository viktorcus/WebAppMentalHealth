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
        res.status(201).redirect('/food');
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
    res.render('foodPage', { user, foodData });
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
    res.json(foodData);
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
    res.sendStatus(200);
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
      keyword,
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
      end,
    );
    res.render('foodStats', { stats });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export default {
  submitFoodData,
  getAllUserFoodData,
  getFoodData,
  updateFoodData,
  deleteFoodData,
  searchFoodData,
  getFoodStats,
};
