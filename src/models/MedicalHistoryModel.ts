import { AppDataSource } from '../dataSource';
import { MedicalHistory } from '../entities/medicalHistory';

const medicalHistoryRepository = AppDataSource.getRepository(MedicalHistory);

async function addMedicalHistory(medicalHistory: MedicalHistory): Promise<MedicalHistory> {
  const newMedicalHistory = new MedicalHistory();
  newMedicalHistory.userId = medicalHistory.userId;
  newMedicalHistory.conditionName = medicalHistory.conditionName;
  newMedicalHistory.treatment = medicalHistory.treatment;
  newMedicalHistory.diagnosisDate = medicalHistory.diagnosisDate;
  if (medicalHistory.note !== undefined) {
    newMedicalHistory.note = medicalHistory.note;
  }

  const savedMedicalHistory = await medicalHistoryRepository.save(newMedicalHistory);

  return savedMedicalHistory;
}

async function getMedicalHistoryById(medicalHistoryId: string): Promise<MedicalHistory | null> {
  const medicalHistory = await medicalHistoryRepository.findOne({ where: { medicalHistoryId } });
  return medicalHistory || null;
}

async function getMedicalHistoryByUserId(userId: string): Promise<MedicalHistory[]> {
  const medicalHistories = await medicalHistoryRepository.find({ where: { userId } });
  return medicalHistories;
}

export { addMedicalHistory, getMedicalHistoryById, getMedicalHistoryByUserId };
