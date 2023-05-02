import { Gender } from '../utils/enums';

type UserInfo = {
  userId: string;
  userName: string;
  email: string;
  verifiedEmail: boolean;
  passwordHash: string;
  birthday: Date;
  gender: Gender;
  place: string;
};

type UserIdParam = {
  userId: string;
};

type AuthRequest = {
  userName: string;
  email: string;
  password: string;
  birthday?: Date;
  place?: string;
  gender?: Gender;
};

export { UserInfo, UserIdParam, AuthRequest };
