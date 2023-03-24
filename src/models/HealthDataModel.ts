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

async function getAllHealthDataById(healthDataId: string): Promise<HealthData[]> {
  const healthData = await healthDataRepository.find({ where: { healthDataId } });

  return healthData;
}

async function getAllHealthDataForUser(userId: number): Promise<HealthData[]> {
  const healthData = await healthDataRepository.find({ where: { userId } });
  return healthData || [];
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

export {
  addHealthData,
  getAllHealthDataById,
  getAllHealthDataForUser,
  updateHealthData,
  deleteHealthData,
};
