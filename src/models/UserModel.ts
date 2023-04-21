import { addWeeks } from 'date-fns';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/user';
import { Gender } from '../utils/enums';

const userRepository = AppDataSource.getRepository(User);

async function addUser(
  userName: string,
  email: string,
  passwordHash: string,
  birthday?: Date,
  place?: string,
  gender?: Gender,
): Promise<User> {
  let newUser = new User();
  newUser.userName = userName;
  newUser.email = email;
  newUser.passwordHash = passwordHash;
  if (birthday) {
    newUser.birthday = birthday;
  }
  if (place) {
    newUser.place = place;
  }
  if (gender) {
    newUser.gender = gender;
  }

  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserByUserName(userName: string): Promise<User | null> {
  const user = await userRepository
    .createQueryBuilder('user')
    .where('userName = :userName', { userName })
    .getOne();
  return user;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { email } });
  return user || null;
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { userId } });
  return user;
}

async function updateEmailAddressById(userId: string, newEmail: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ email: newEmail })
    .where({ userId })
    .execute();
}

async function updateNameById(userId: string, newUserName: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ userName: newUserName })
    .where({ userId })
    .execute();
}

async function updatePlaceById(userId: string, newPlace: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ place: newPlace })
    .where({ userId })
    .execute();
}

async function updateGenderById(userId: string, newGender: Gender): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ gender: newGender })
    .where({ userId })
    .execute();
}

async function updateBirthdayById(userId: string, newBirthday: Date): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ birthday: newBirthday })
    .where({ userId })
    .execute();
}

async function getRemindersDueInOneWeek(): Promise<User[]> {
  const today = new Date();
  const oneWeekFromToday = addWeeks(today, 2);

  const users = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.reminders', 'reminders')
    .select(['user.userId', 'user.email', 'user.username', 'reminders'])
    .where('reminders.sendNotificationOn <= :oneWeekFromToday', { oneWeekFromToday })
    .andWhere('reminders.sendNotificationOn > :today', { today })
    .getMany();

  return users;
}

export {
  addUser,
  getUserByUserName,
  getUserByEmail,
  getUserById,
  updateEmailAddressById,
  updateNameById,
  updatePlaceById,
  updateGenderById,
  updateBirthdayById,
  getRemindersDueInOneWeek,
};
