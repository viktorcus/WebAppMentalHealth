type HealthData = {
  healthDataId: number;
  userId: string;
  measurementDate: Date;
  weight: number;
  height: number;
  bmi: number;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  note: string;
};

type HealthDataStats = {
  date: Date;
  weight?: number;
  bmi?: number;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
};

type HealthSearchParam = {
  start: Date;
  end: Date;
  type: string;
};
