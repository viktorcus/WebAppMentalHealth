import type { UserInfo } from "./userInfo.js";

type ActivityData = {
    activityDataId: number,
    user: UserInfo,
    activityType: string,
    startTime: Date,
    endTime: Date,
    caloriesBurned: number | null,
    note: string | null,
};

type ActivityDataIdParam = {
    activityDataId: number,
};