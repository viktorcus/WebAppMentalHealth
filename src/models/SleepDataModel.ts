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

async function getAllSleepDataForUser(userId: number): Promise<SleepData[]> {
  return await sleepRepository
    .createQueryBuilder('sleepData')
    .leftJoinAndSelect('sleepData.user', 'user')
    .where('user.userId = :userId', { userId })
    .select(['sleepData', 'user.userId'])
    .getMany();
}

async function generateSleepStats(
  userId: string,
  start: Date,
  end: Date,
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
        s.date.getDate() === data.sleepDate.getDate(),
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
          data.sleepDate.getDate(),
        ),
        hours: data.hoursSlept,
        quality: data.quality,
        note: data.note,
      });
    }
  }
  return stats.sort((a, b) => a.date.valueOf() - b.date.valueOf());
}

export { addSleepData, getAllSleepDataForUser, generateSleepStats };
