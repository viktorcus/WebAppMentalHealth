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
};

export declare enum Gender {
  Male,
  Female,
  Other,
}

export { UserInfo, UserIdParam, AuthRequest };
