import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addUser, getUserByEmail, getUserById } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import { AuthRequest, UserIdParam } from '../types/userInfo';

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
    res.sendStatus(404);
    return;
  }

  res.sendStatus(200);
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
export { registerUser, logIn, getUserInfo };
