type ActivityData = {
    activityDataId: number,
    userId: number,
    activityType: string,
    date: Date,
    startTime: Date,
    endTime: Date,
    caloriesBurned: number | null,
    note: string | null,
};

type ActivityDataIdParam = {
    activityDataId: number,
};