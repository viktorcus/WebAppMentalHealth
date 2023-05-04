type HealthData = {
  healthDataId: number;
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

type HealthRefreshParam = {
  startStr: string;
  endStr: string;
  type: string;
};
