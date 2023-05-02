import { Request, Response } from 'express';
import argon2 from 'argon2';
import {
  addUser,
  getUserByEmail,
  getUserById,
  updateBirthdayById,
  updateEmailAddressById,
  updateGenderById,
  updateNameById,
  updatePlaceById,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import { getActivityDataToday } from '../models/ActivityDataModel';
import { AuthRequest, UserIdParam } from '../types/userInfo';
import { Gender } from '../utils/enums';
import { sendEmail } from '../services/emailService';
import { addReminder } from '../models/ReminderModel';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { userName, email, password, birthday, place, gender } = req.body as AuthRequest;

  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addUser(userName, email, passwordHash, birthday, place, gender);
    console.log(newUser);
    await sendEmail(email, 'Welcome!', `Thank you for joining my application!`);
    res.status(201).redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  const { passwordHash } = user;

  if (!(await argon2.verify(passwordHash, password))) {
    if (!req.session.logInAttempts) {
      req.session.logInAttempts = 1; // First attempt
    } else {
      req.session.logInAttempts += 1; // increment their attempts
    }
    res.sendStatus(403);
    return;
  }

  // NOTES: Remember to clear the session before setting their authenticated session data
  await req.session.clearSession();

  // NOTES: Now we can add whatever data we want to the session
  req.session.authenticatedUser = {
    userId: user.userId,
    email: user.email,
  };
  req.session.isLoggedIn = true;
  res.redirect('/');
}

async function getUserInfo(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;

  const user = await getUserById(userId);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.json(user);
}

async function getUserDashboard(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    // check that user is logged in
    res.redirect('/login');
    return;
  }

  const user = await getUserById(req.session.authenticatedUser.userId);
  const dashData = {
    activityData: await getActivityDataToday(req.session.authenticatedUser.userId),
  };
  console.log({ dashData, user });
  res.render('dashboard', { dashData, user });
}

async function updateEmailAddress(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || authenticatedUser.userId !== userId) {
    res.sendStatus(403); // 403 forbidden
    return;
  }

  const { email } = req.body as { email: string };

  // Get the user account
  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  // Now update their email address using try/catch block
  try {
    await updateEmailAddressById(userId, email);
  } catch (err) {
    // The email was taken so we need to send an error message
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

async function updatePlace(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || authenticatedUser.userId !== userId) {
    res.sendStatus(403);
    return;
  }

  const { place } = req.body as { place: string };

  // Get the user account
  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  // Now update their place using try/catch block
  try {
    await updatePlaceById(userId, place);
  } catch (err) {
    // There could be invalid input
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

async function updateGender(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || authenticatedUser.userId !== userId) {
    res.sendStatus(403);
    return;
  }

  const { gender } = req.body as { gender: Gender };

  // Get the user account
  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  // Now update their gender using try/catch block
  try {
    await updateGenderById(userId, gender);
  } catch (err) {
    // The gender is invalid
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

async function updateUserName(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || authenticatedUser.userId !== userId) {
    res.sendStatus(403);
    return;
  }

  const { userName } = req.body as { userName: string };

  // Get the user account
  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  // Now update their user name using try/catch block
  try {
    await updateNameById(userId, userName);
  } catch (err) {
    // The user name was taken so we need to send an error message
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

async function updateBirthday(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || authenticatedUser.userId !== userId) {
    res.sendStatus(403);
    return;
  }

  const { birthday } = req.body as { birthday: Date };

  // Get the user account
  const user = await getUserById(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  // Now update their birthday using try/catch block
  try {
    await updateBirthdayById(userId, birthday);
  } catch (err) {
    // The birthday was invalid
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

async function createReminder(req: Request, res: Response): Promise<void> {
  if (!req.session.isLoggedIn) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }

  const { authenticatedUser } = req.session;
  const user = await getUserById(authenticatedUser.userId);

  if (user) {
    const { sendNotificationOn, items } = req.body as CreateReminderBody;
    await addReminder(sendNotificationOn, items, user);
  }

  res.sendStatus(201);
}

export {
  registerUser,
  logIn,
  getUserInfo,
  updateEmailAddress,
  updatePlace,
  updateGender,
  updateUserName,
  updateBirthday,
  createReminder,
  getUserDashboard,
};
