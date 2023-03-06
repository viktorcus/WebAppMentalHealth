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

export declare enum Gender {
  Male,
  Female,
  Other,
}

export { UserInfo };
