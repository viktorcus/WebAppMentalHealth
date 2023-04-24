type SleepData = {
  sleepDataId: number;
  userId: number;
  sleepDate: Date;
  hoursSlept: number;
  quality: string;
  note: string;
};

type SleepDataStats = {
  date: Date;
  hours: number;
};

type SleepSearchParam = {
  start: Date;
  end: Date;
};
