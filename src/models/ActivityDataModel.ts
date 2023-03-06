import moment from 'moment';
import { AppDataSource } from '../dataSource';
import { ActivityData as ActivityDataEntity } from '../entities/activityData';


const activityRepository = AppDataSource.getRepository(ActivityDataEntity);

async function addActivityData(activityData: ActivityData): Promise<ActivityData> {
    let newActivity = new ActivityDataEntity();
    newActivity.userId = activityData.userId;
    newActivity.activityType = activityData.activityType;
    newActivity.date = activityData.date;
    newActivity.startTime = activityData.startTime;
    newActivity.endTime = activityData.endTime;
    if(activityData.caloriesBurned) {
        newActivity.caloriesBurned = activityData.caloriesBurned;
    }
    if(activityData.note) {
        newActivity.note = activityData.note;
    }


    newActivity = await activityRepository.save(newActivity);
    return newActivity;
}

async function getAllActivityDataForUser(userId: number): Promise<ActivityData[]> {
    return activityRepository.find({ where: { userId } });
}

async function getActivityDataById(activityDataId: number): Promise<ActivityData | null> {
    return activityRepository.findOne({ where: { activityDataId } });
}

// calculates the number of minutes an activity endured
async function getActivityDuration(activityDataId: number): Promise<number | null> {
    // check that activity exists
    const activity = await getActivityDataById(activityDataId);
    if(! activity) {  // failed to find
        return null;
    }

    const start = moment(activity.startTime);
    const end = moment(activity.endTime);
    return end.diff(start, 'minute');
}

// generic method to update multiple fields of an activity at once
async function updateActivityDataById(activityDataId: number, newActivity: ActivityData): Promise<ActivityData | null> {
    // check that activity exists
    const activity = await activityRepository.findOne({ where: { activityDataId } });
    if(! activity) {  // failed to find
        return null;
    }

    if(newActivity.activityType !== activity.activityType) {
        activity.activityType = newActivity.activityType;
    }
    if(newActivity.date !== activity.date) {
        activity.date = newActivity.date;
    }
    if(newActivity.startTime !== activity.startTime) {
        activity.startTime = newActivity.startTime;
    }
    if(newActivity.endTime !== activity.endTime) {
        activity.endTime = newActivity.endTime;
    }
    if(newActivity.caloriesBurned && newActivity.caloriesBurned !== activity.caloriesBurned) {
        activity.caloriesBurned = newActivity.caloriesBurned;
    }
    if(newActivity.note && newActivity.note !== activity.note) {
        activity.note = newActivity.note;
    }

    activityRepository.save(activity);
    return activity;
}

// finds activity types that the user has submitted before
// can be used in the UI so that the user can pick from their saved activity types instead of always typing it out
async function getActivityTypesForUser(userId: number): Promise<string[]> {
    const types = await activityRepository
                .createQueryBuilder('activityData')
                .where('userId = :userId', { userId })
                .select(['activityData.activityType'])
                .getMany();
    return types.map(t => t.activityType);
}

export { 
    addActivityData,
    getAllActivityDataForUser,
    getActivityDataById,
    getActivityDuration,
    getActivityTypesForUser,
    updateActivityDataById,
};