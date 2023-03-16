type ActivityData = {
  activityDataId: number;
  userId: string;
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
