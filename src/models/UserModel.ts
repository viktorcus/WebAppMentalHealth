import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(userName: string, email: string, passwordHash: string): Promise<User> {
  let newUser = new User();
  newUser.userName = userName;
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { email } });
  return user || null;
}

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { userId } });
  return user;
}

export { addUser, getUserByEmail, getUserById };
