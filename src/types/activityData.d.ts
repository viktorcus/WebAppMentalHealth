type ActivityData = {
  activityDataId: number;
  activityType: string;
  startTime: Date;
  endTime: Date;
  caloriesBurned?: number;
  note?: string;
};

type ActivityDataIdParam = {
  activityDataId: number;
};

type ActivitySearchParam = {
  start?: Date;
  end?: Date;
  keyword?: string;
};

type ActivityStats = {
  type: string;
  duration: number; // duration in minutes
};
