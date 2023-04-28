import { AppDataSource } from '../dataSource';
import { SleepData } from '../entities/sleepData';

const sleepRepository = AppDataSource.getRepository(SleepData);

async function addSleepData(sleepData: SleepData): Promise<SleepData> {
  let newSleepData = new SleepData();
  newSleepData.userId = sleepData.userId;
  newSleepData.sleepDate = sleepData.sleepDate;
  newSleepData.hoursSlept = sleepData.hoursSlept;
  newSleepData.quality = sleepData.quality;
  newSleepData.note = sleepData.note;

  newSleepData = await sleepRepository.save(newSleepData);
  return newSleepData;
}

async function getAllSleepDataForUser(userId: string): Promise<SleepData[]> {
  const sleepData = await sleepRepository
    .createQueryBuilder('sleepData')
    .leftJoinAndSelect('sleepData.user', 'user')
    .where('user.userId = :userId', { userId })
    .getMany();
  return sleepData;
}

async function getSleepDataById(sleepDataId: string): Promise<SleepData | null> {
  const sleepData = await sleepRepository.findOne({ where: { sleepDataId } });
  return sleepData || null;
}

async function updateSleepData(sleepDataId: string, sleepData: SleepData): Promise<SleepData | null> {
  let updatedSleepData = await getSleepDataById(sleepDataId);

  if (!updatedSleepData) {
    return null;
  }

  updatedSleepData.userId = sleepData.userId;
  updatedSleepData.sleepDate = sleepData.sleepDate;
  updatedSleepData.hoursSlept = sleepData.hoursSlept;
  updatedSleepData.quality = sleepData.quality;
  updatedSleepData.note = sleepData.note;

  updatedSleepData = await sleepRepository.save(updatedSleepData);
  return updatedSleepData;
}

async function deleteSleepData(sleepDataId: string): Promise<void> {
  await sleepRepository
    .createQueryBuilder('sleepData')
    .delete()
    .where('sleepDataId = :sleepDataId', { sleepDataId })
    .execute();
}

async function getSleepDataByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<SleepData[]> {
  return sleepRepository
    .createQueryBuilder('sleepData')
    .where('sleepData.userId = :userId', { userId })
    .andWhere('sleepData.sleepDate >= :startDate', { startDate })
    .andWhere('sleepData.sleepDate <= :endDate', { endDate })
    .orderBy('sleepData.sleepDate', 'ASC')
    .getMany();
}

export {
  addSleepData,
  getAllSleepDataForUser,
  getSleepDataById,
  updateSleepData,
  deleteSleepData,
  getSleepDataByDateRange,
};
