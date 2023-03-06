import { AppDataSource } from '../dataSource';
import { MedicationData } from '../entities/medicationData';

const medicationDataRepository = AppDataSource.getRepository(MedicationData);

async function addMedicationData(
  userId: string,
  medicationName: string,
  dosage: string,
  frequency: string,
  note?: string
): Promise<MedicationData> {
  let newMedicationData = new MedicationData();
  newMedicationData.userId = userId;
  newMedicationData.medicationName = medicationName;
  newMedicationData.dosage = dosage;
  newMedicationData.frequency = frequency;
  if (note !== undefined) {
    newMedicationData.note = note;
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
