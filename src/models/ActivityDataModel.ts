import { AppDataSource } from '../dataSource';
import { ActivityData as ActivityDataEntity } from '../entities/activityData';


const activityRepository = AppDataSource.getRepository(ActivityDataEntity);

async function addActivityData(activityData: ActivityData): Promise<ActivityData> {
    let newActivity = new ActivityDataEntity();
    newActivity.userId = activityData.userId;
    newActivity.activityType = activityData.activityType;
    newActivity.caloriesBurned = activityData.caloriesBurned;
    newActivity.date = activityData.date;
    newActivity.startTime = activityData.startTime;
    newActivity.endTime = activityData.endTime;
    newActivity.note = activityData.note;


    newActivity = await activityRepository.save(newActivity);
    return newActivity;
}

async function getAllActivityDataForUser(userId: number): Promise<ActivityData[]> {
    return activityRepository.find({ where: { userId } });
}

export { 
    addActivityData,
    getAllActivityDataForUser,
};