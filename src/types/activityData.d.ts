type ActivityData = {
    activityDataId: number,
    userId: string,
    activityType: string,
    startTime: Date,
    endTime: Date,
    caloriesBurned: number | undefined,
    note: string | undefined,
};

type ActivityDataIdParam = {
    activityDataId: number,
};