import moment from 'moment';
import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { ActivityData as ActivityDataEntity } from '../entities/activityData';

const activityRepository = AppDataSource.getRepository(ActivityDataEntity);

async function addActivityData(activityData: ActivityData): Promise<void> {
  activityRepository
    .createQueryBuilder()
    .insert()
    .into(ActivityDataEntity)
    .values({
      user: { userId: activityData.userId },
      activityType: activityData.activityType,
      startTime: activityData.startTime,
      endTime: activityData.endTime,
      caloriesBurned: activityData.caloriesBurned,
      note: activityData.note,
    })
    .execute();
}

async function getAllActivityDataForUser(userId: string): Promise<ActivityDataEntity[]> {
  return activityRepository.find({ where: { user: { userId } } });
}

async function getActivityDataById(activityDataId: number): Promise<ActivityDataEntity | null> {
  return activityRepository.findOne({ where: { activityDataId } });
}

async function getActivityDataBySearch(
  start?: Date,
  end?: Date,
  keyword?: string,
): Promise<ActivityDataEntity[]> {
  const query: SelectQueryBuilder<ActivityDataEntity> =
    activityRepository.createQueryBuilder('activityData');
  if (start) {
    // add start time to search
    query.andWhere('activityData.endTime >= :startTime', { startTime: start });
  }
  if (end) {
    // add end time to search
    query.andWhere('activityData.startTime <= :endTime', { endTime: end });
  }
  if (keyword) {
    // search if type or note contains keyword
    query.andWhere('activityData.activityType like :key or activityData.note like :key', {
      key: `%${keyword}%`,
    });
  }
  return query.getMany();
}

// calculates the number of minutes an activity endured
async function getActivityDuration(activityDataId: number): Promise<number | null> {
  // check that activity exists
  const activity = await getActivityDataById(activityDataId);
  if (!activity) {
    // failed to find
    return null;
  }

  const start = moment(activity.startTime);
  const end = moment(activity.endTime);
  return end.diff(start, 'minute');
}

function getDuration(startTime: Date, endTime: Date): number {
  const start = moment(startTime);
  const end = moment(endTime);
  return end.diff(start, 'minute');
}

// generic method to update multiple fields of an activity at once
async function updateActivityDataById(
  activityDataId: number,
  newActivity: ActivityData,
): Promise<ActivityDataEntity | null> {
  // check that activity exists
  const activity = await activityRepository.findOne({ where: { activityDataId } });
  if (!activity) {
    // failed to find
    return null;
  }

  if (newActivity.activityType !== activity.activityType) {
    activity.activityType = newActivity.activityType;
  }
  if (newActivity.startTime !== activity.startTime) {
    activity.startTime = newActivity.startTime;
  }
  if (newActivity.endTime !== activity.endTime) {
    activity.endTime = newActivity.endTime;
  }
  if (newActivity.caloriesBurned && newActivity.caloriesBurned !== activity.caloriesBurned) {
    activity.caloriesBurned = newActivity.caloriesBurned;
  }
  if (newActivity.note && newActivity.note !== activity.note) {
    activity.note = newActivity.note;
  }

  activityRepository.save(activity);
  return activity;
}

// finds activity types that the user has submitted before
// can be used in the UI so that the user can pick from their saved activity types instead of always typing it out
async function getActivityTypesForUser(userId: string): Promise<string[]> {
  const types: ActivityDataEntity[] = await activityRepository
    .createQueryBuilder('activityData')
    .where('userId = :userId', { userId })
    .select(['activityData.activityType'])
    .getMany();
  return types.map((t) => t.activityType);
}

async function deleteActivityDataById(activityDataId: number): Promise<void> {
  activityRepository.delete({ activityDataId });
}

async function generateActivityStats(start: Date, end: Date): Promise<ActivityStats[]> {
  // will also include userid once session management is in place
  const activities: ActivityDataEntity[] = await activityRepository
    .createQueryBuilder('activityData')
    .where('startTime >= :start and endTime <= :end', { start, end })
    .getMany();

  const stats: ActivityStats[] = [];
  for (const activity of activities) {
    const idx = stats.findIndex((s) => s.type === activity.activityType);
    if (idx >= 0) {
      const stat = stats.at(idx);
      stats.at(idx)!.duration = getDuration(activity.startTime, activity.endTime) + stat!.duration;
    } else {
      stats.push({
        type: activity.activityType,
        duration: getDuration(activity.startTime, activity.endTime),
      });
    }
  }
  return stats;
}

export {
  addActivityData,
  getAllActivityDataForUser,
  getActivityDataById,
  getActivityDuration,
  getActivityTypesForUser,
  getActivityDataBySearch,
  updateActivityDataById,
  deleteActivityDataById,
  generateActivityStats,
};
