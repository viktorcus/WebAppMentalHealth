type ActivityData = {
    activityDataId: number,
    userId: number,
    activityType: string,
    date: Date,
    startTime: Date,
    endTime: Date,
    caloriesBurned: number,
    note: string,
};

type ActivityDataIdParam = {
    activityDataId: number,
};