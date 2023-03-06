import { AppDataSource } from '../dataSource';
import { MedicalHistory } from '../entities/medicalHistory';

const medicalHistoryRepository = AppDataSource.getRepository(MedicalHistory);

async function addMedicalHistory(
  userId: string,
  conditionName: string,
  treatment: string,
  diagnosisDate: Date,
  note?: string
): Promise<MedicalHistory> {
  const newMedicalHistory = new MedicalHistory();
  newMedicalHistory.userId = userId;
  newMedicalHistory.conditionName = conditionName;
  newMedicalHistory.treatment = treatment;
  newMedicalHistory.diagnosisDate = diagnosisDate;
  if (note !== undefined) {
    newMedicalHistory.note = note;
  }

  const savedMedicalHistory = await medicalHistoryRepository.save(newMedicalHistory);

  return savedMedicalHistory;
}

async function getMedicalHistoryById(medicalHistoryId: string): Promise<MedicalHistory | null> {
  const medicalHistory = await medicalHistoryRepository.findOne({ where: { medicalHistoryId } });
  return medicalHistory || null;
}

async function getMedicalHistoriesByUserId(userId: string): Promise<MedicalHistory[]> {
  const medicalHistories = await medicalHistoryRepository.find({ where: { userId } });
  return medicalHistories;
}

export { addMedicalHistory, getMedicalHistoryById, getMedicalHistoriesByUserId };
