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

// async function updateSleepDataById(userId: number, sleepData: SleepData): Promise<SleepData> {
//   // Get the existing SleepData object from the database
//   const existingSleepData = await sleepRepository.findOne(userId);

//   // Update the existing SleepData object with the new data
//   existingSleepData.userId = sleepData.userId;
//   existingSleepData.sleepDate = sleepData.sleepDate;
//   existingSleepData.hoursSlept = sleepData.hoursSlept;
//   existingSleepData.quality = sleepData.quality;
//   existingSleepData.note = sleepData.note;

//   // Save the updated SleepData object to the database
//   const updatedSleepData = await sleepRepository.save(existingSleepData);

//   // Return the updated SleepData object
//   return updatedSleepData;
// }

export { addSleepData, getAllSleepDataForUser };
