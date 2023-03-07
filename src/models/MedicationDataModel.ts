import { AppDataSource } from '../dataSource';
import { MedicationData } from '../entities/medicationData';

const medicationDataRepository = AppDataSource.getRepository(MedicationData);

async function addMedicationData(medicationData: MedicationData): Promise<MedicationData> {
  let newMedicationData = new MedicationData();
  newMedicationData.medicationDataId = medicationData.medicationDataId;
  newMedicationData.userId = medicationData.userId;
  newMedicationData.medicationName = medicationData.medicationName;
  newMedicationData.dosage = medicationData.dosage;
  newMedicationData.frequency = medicationData.frequency;
  if (medicationData.note !== undefined) {
    newMedicationData.note = medicationData.note;
  }

  newMedicationData = await medicationDataRepository.save(newMedicationData);

  return newMedicationData;
}

async function getMedicationDataById(medicationDataId: string): Promise<MedicationData | null> {
  const medicationData = await medicationDataRepository.findOne({ where: { medicationDataId } });
  return medicationData || null;
}

async function getMedicationDataByUserId(userId: string): Promise<MedicationData[]> {
  const medicationData = await medicationDataRepository.find({ where: { userId } });
  return medicationData;
}

export { addMedicationData, getMedicationDataById, getMedicationDataByUserId };
