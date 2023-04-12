import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addUser, getUserByEmail, getUserById } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import { AuthRequest, UserIdParam } from '../types/userInfo';
import { getActivityDataToday } from '../models/ActivityDataModel';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { userName, email, password } = req.body as AuthRequest;

  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addUser(userName, email, passwordHash);
    console.log(newUser);
    res.sendStatus(201);
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

  await req.session.clearSession();
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
export { registerUser, logIn, getUserInfo, getUserDashboard };
