import { AppDataSource } from '../dataSource';
import { MedicalHistory } from '../entities/medicalHistory';

const medicalHistoryRepository = AppDataSource.getRepository(MedicalHistory);

async function addMedicalHistory(medicalHistory: MedicalHistory): Promise<MedicalHistory> {
  let newMedicalHistory = new MedicalHistory();
  newMedicalHistory.conditionName = medicalHistory.conditionName;
  newMedicalHistory.treatment = medicalHistory.treatment;
  newMedicalHistory.diagnosisDate = medicalHistory.diagnosisDate;
  if (medicalHistory.note !== undefined) {
    newMedicalHistory.note = medicalHistory.note;
  }

  newMedicalHistory = await medicalHistoryRepository.save(newMedicalHistory);

  return newMedicalHistory;
}

async function getMedicalHistoryById(medicalHistoryId: string): Promise<MedicalHistory | null> {
  const medicalHistory = await medicalHistoryRepository
    .createQueryBuilder('medicalHistory')
    .where({ where: { medicalHistoryId } })
    .leftJoin('medicalHistory.user', 'user')
    .select([
      'medicalHistory.medicalHistoryId',
      'medicalHistory.conditionName',
      'medicalHistory.diagnosisDate',
      'medicalHistory.treatment',
      'medicalHistory.note',
      'user.userId',
    ])
    .getOne();
  return medicalHistory || null;
}

async function getMedicalHistoryByUserId(userId: string): Promise<MedicalHistory[]> {
  const medicalHistories = await medicalHistoryRepository
    .createQueryBuilder('medicalHistory')
    .leftJoinAndSelect('medicalHistory.user', 'user')
    .where('user.userId = :userId', { userId })
    .select(['medicalHistory', 'user.userId'])
    .getMany();

  return medicalHistories;
}

async function updateMedicalHistoryDataById(
  medicalHistoryId: string,
  newMedicalHistory: Partial<MedicalHistory>
): Promise<void> {
  await medicalHistoryRepository
    .createQueryBuilder()
    .update(MedicalHistory)
    .set(newMedicalHistory)
    .where({ medicalHistoryId })
    .execute();
}

async function medicalHistoryBelongsToUser(
  medicalHistoryId: string,
  userId: string
): Promise<boolean> {
  const medicalHistoryExists = await medicalHistoryRepository
    .createQueryBuilder('medicalHistory')
    .leftJoinAndSelect('medicalHistory.user', 'user')
    .where('medicalHistory.medicalHistoryId = :medicalHistoryId', { medicalHistoryId })
    .andWhere('user.userId = :userId', { userId })
    .getExists();

  return medicalHistoryExists;
}

async function deleteMedicalHistoryById(medicalHistoryId: string): Promise<void> {
  await medicalHistoryRepository
    .createQueryBuilder('medicalHistory')
    .delete()
    .where('medicalHistoryId = :medicalHistoryId', { medicalHistoryId })
    .execute();
}

export {
  addMedicalHistory,
  getMedicalHistoryById,
  getMedicalHistoryByUserId,
  updateMedicalHistoryDataById,
  medicalHistoryBelongsToUser,
  deleteMedicalHistoryById,
};
