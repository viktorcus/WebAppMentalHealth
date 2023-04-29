import { AppDataSource } from '../dataSource';
import { HealthData } from '../entities/healthData';

const healthDataRepository = AppDataSource.getRepository(HealthData);

async function addHealthData(healthData: HealthData): Promise<HealthData> {
  let newHealthData = new HealthData();
  newHealthData.userId = healthData.userId;
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

async function getAllHealthDataById(healthDataId: string): Promise<HealthData | null> {
  const healthData = await healthDataRepository.findOne({ where: { healthDataId } });

  return healthData || null;
}

async function getAllHealthDataForUser(userId: string): Promise<HealthData[]> {
  const healthData = await healthDataRepository
    .createQueryBuilder('healthData')
    .leftJoinAndSelect('healthData.user', 'user')
    .where('user.userId = :userId', { userId })
    .getMany();

  return healthData;
}

async function updateHealthData(
  healthDataId: string,
  newHealthData: HealthData
): Promise<void | null> {
  await healthDataRepository
    .createQueryBuilder()
    .update(HealthData)
    .set(newHealthData)
    .where({ healthDataId })
    .execute();
}

async function deleteHealthData(healthDataId: string): Promise<void> {
  await healthDataRepository
    .createQueryBuilder('HealthData')
    .delete()
    .where('healthDataId = :healthDataId', { healthDataId })
    .execute();
}

export {
  addHealthData,
  getAllHealthDataById,
  getAllHealthDataForUser,
  updateHealthData,
  deleteHealthData,
};
