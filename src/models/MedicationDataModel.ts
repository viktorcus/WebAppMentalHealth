import { AppDataSource } from '../dataSource';
import { MedicationData } from '../entities/medicationData';

const medicationDataRepository = AppDataSource.getRepository(MedicationData);

async function addMedicationData(medicationData: MedicationData): Promise<MedicationData> {
  let newMedicationData = new MedicationData();
  newMedicationData.medicationDataId = medicationData.medicationDataId;
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
  const medicationData = await medicationDataRepository
    .createQueryBuilder('medicationData')
    .leftJoinAndSelect('medicationData.user', 'user')
    .where('user.userId = :userId', { userId })
    .getMany();
  return medicationData;
}

async function updateMedicationDataById(
  medicationDataId: string,
  newMedicationData: Partial<MedicationData>
): Promise<void> {
  await medicationDataRepository
    .createQueryBuilder()
    .update(MedicationData)
    .set(newMedicationData)
    .where({ medicationDataId })
    .execute();
}

async function medicationDataBelongsToUser(
  medicationDataId: string,
  userId: string
): Promise<boolean> {
  const medicationDataExists = await medicationDataRepository
    .createQueryBuilder('medicationData')
    .leftJoinAndSelect('medicationData.user', 'user')
    .where('medicationData.medicationDataId = :medicationDataId', { medicationDataId })
    .andWhere('user.userId = :userId', { userId })
    .getExists();

  return medicationDataExists;
}

async function deleteMedicationDataById(medicationDataId: string): Promise<void> {
  await medicationDataRepository
    .createQueryBuilder('medicationData')
    .delete()
    .where('medicationDataId = :medicationDataId', { medicationDataId })
    .execute();
}

export {
  addMedicationData,
  getMedicationDataById,
  getMedicationDataByUserId,
  updateMedicationDataById,
  medicationDataBelongsToUser,
  deleteMedicationDataById,
};
