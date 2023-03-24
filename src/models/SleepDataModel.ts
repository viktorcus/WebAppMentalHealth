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

async function getAllSleepDataForUser(userId: number): Promise<SleepData[]> {
  return sleepRepository.find({ where: { userId } });
}

export { addSleepData, getAllSleepDataForUser };
