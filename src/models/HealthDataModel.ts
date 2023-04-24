import { AppDataSource } from '../dataSource';
import { HealthData } from '../entities/healthData';
import { User } from '../entities/user';

const healthDataRepository = AppDataSource.getRepository(HealthData);

async function addHealthData(healthData: HealthData, user: User): Promise<HealthData> {
  let newHealthData = new HealthData();
  newHealthData.user = user;
  newHealthData.measurementDate = healthData.measurementDate;
  newHealthData.weight = healthData.weight;
  newHealthData.height = healthData.height;
  newHealthData.bmi = healthData.bmi;
  newHealthData.heartRate = healthData.heartRate;
  newHealthData.bloodPressureSystolic = healthData.bloodPressureSystolic;
  newHealthData.bloodPressureDiastolic = healthData.bloodPressureDiastolic;

  newHealthData = await healthDataRepository.save(newHealthData);
  return newHealthData;
}

async function getAllHealthDataById(healthDataId: string): Promise<HealthData[]> {
  const healthData = await healthDataRepository.find({ where: { healthDataId } });

  return healthData;
}

async function getAllHealthDataForUser(userId: number): Promise<HealthData[]> {
  return await healthDataRepository
    .createQueryBuilder('healthData')
    .leftJoinAndSelect('healthData.user', 'user')
    .where('user.userId = :userId', { userId })
    .select(['healthData', 'user.userId'])
    .getMany();
}

async function updateHealthData(healthData: HealthData): Promise<HealthData | null> {
  const existingHealthData = await healthDataRepository.findOne({
    where: { healthDataId: healthData.healthDataId },
  });

  if (!existingHealthData) {
    return null;
  }

  const updatedHealthData = healthDataRepository.merge(existingHealthData, healthData);
  await healthDataRepository.save(updatedHealthData);
  return updatedHealthData;
}

async function deleteHealthData(healthDataId: string): Promise<void> {
  await healthDataRepository.delete(healthDataId);
}

async function generateHealthStats(
  userId: string,
  start: Date,
  end: Date,
  type: string,
): Promise<HealthDataStats[]> {
  // will also include userid once session management is in place
  const healthData: HealthData[] = await healthDataRepository
    .createQueryBuilder('healthData')
    .where(
      'healthData.user.userId = :userId and measurementDate >= :start and measurementDate <= :end',
      {
        userId,
        start,
        end,
      },
    )
    .getMany();

  const stats: HealthDataStats[] = [];
  for (const data of healthData) {
    const statsEntry: HealthDataStats = {
      date: new Date(
        data.measurementDate.getFullYear(),
        data.measurementDate.getMonth(),
        data.measurementDate.getDate(),
      ),
    };

    switch (type) {
      case 'weight': {
        statsEntry.weight = data.weight;
        break;
      }
      case 'bmi': {
        statsEntry.bmi = data.bmi;
        break;
      }
      case 'heartRate': {
        statsEntry.heartRate = data.heartRate;
        break;
      }
      case 'bloodPressure': {
        statsEntry.bloodPressureSystolic = data.bloodPressureSystolic;
        statsEntry.bloodPressureDiastolic = data.bloodPressureDiastolic;
        break;
      }
      default: {
        break;
      }
    }

    stats.push(statsEntry);
  }
  return stats;
}

export {
  addHealthData,
  getAllHealthDataById,
  getAllHealthDataForUser,
  updateHealthData,
  deleteHealthData,
  generateHealthStats,
};
