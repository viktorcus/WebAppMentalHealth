type UserInfo = {
  userId: number;
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
