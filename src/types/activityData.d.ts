type ActivityData = {
    activityDataId: number,
    userId: string,
    activityType: string,
    startTime: Date,
    endTime: Date,
    caloriesBurned: number | null,
    note: string | null,
};

type ActivityDataIdParam = {
    activityDataId: number,
};