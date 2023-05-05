type SleepData = {
  sleepDataId: string;
  sleepDate: Date;
  hoursSlept: number;
  quality: string;
  note: string;
};

type SleepDataStats = {
  date: Date;
  hours: number;
  quality?: string;
  note?: string;
};

type SleepSearchParam = {
  start: Date;
  end: Date;
};

type SleepRefreshParam = {
  startStr: string;
  endStr: string;
};
