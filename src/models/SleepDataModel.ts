import { AppDataSource } from '../dataSource';
import { SleepData } from '../entities/sleepData';
import { User } from '../entities/user';

const sleepRepository = AppDataSource.getRepository(SleepData);

async function addSleepData(sleepData: SleepData, user: User): Promise<SleepData> {
  let newSleepData = new SleepData();
  newSleepData.user = user;
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

async function updateSleepData(
  sleepDataId: string,
  sleepData: SleepData
): Promise<SleepData | null> {
  let updatedSleepData = await getSleepDataById(sleepDataId);

  if (!updatedSleepData) {
    return null;
  }

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

async function generateSleepStats(
  userId: string,
  start: Date,
  end: Date
): Promise<SleepDataStats[]> {
  // will also include userid once session management is in place
  const sleep: SleepData[] = await sleepRepository
    .createQueryBuilder('sleepData')
    .where('sleepData.user.userId = :userId and sleepDate >= :start and sleepDate <= :end', {
      userId,
      start,
      end,
    })
    .getMany();

  const stats: SleepDataStats[] = [];
  for (const data of sleep) {
    const idx = stats.findIndex(
      (s) =>
        s.date.getFullYear() === data.sleepDate.getFullYear() &&
        s.date.getMonth() === data.sleepDate.getFullYear() &&
        s.date.getDate() === data.sleepDate.getDate()
    );
    if (idx >= 0) {
      const sleepStat = stats.at(idx);
      if (sleepStat?.hours) {
        sleepStat.hours += data.hoursSlept;
      }
    } else {
      stats.push({
        date: new Date(
          data.sleepDate.getFullYear(),
          data.sleepDate.getMonth(),
          data.sleepDate.getDate()
        ),
        hours: data.hoursSlept,
        quality: data.quality,
        note: data.note,
      });
    }
  }
  return stats.sort((a, b) => a.date.valueOf() - b.date.valueOf());
}

export {
  addSleepData,
  getAllSleepDataForUser,
  getSleepDataById,
  updateSleepData,
  deleteSleepData,
  getSleepDataByDateRange,
  generateSleepStats,
};
