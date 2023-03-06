type ActivityData = {
    activityDataId: number,
    userId: string,
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