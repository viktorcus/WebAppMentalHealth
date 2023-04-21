type MedicalHistory = {
  medicalHistoryId: string;
  conditionName: string;
  diagnosisDate: Date;
  treatment: string;
  note: string;
};

type MedicalHistoryIdParam = {
  medicalHistoryId: string;
};
