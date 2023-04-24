import moment from 'moment';
import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { ActivityData as ActivityDataEntity } from '../entities/activityData';
import { User } from '../entities/user';

const activityRepository = AppDataSource.getRepository(ActivityDataEntity);

async function addActivityData(
  activityData: ActivityData,
  user: User
): Promise<ActivityDataEntity | null> {
  const newActivity = new ActivityDataEntity();
  newActivity.activityType = activityData.activityType;
  newActivity.startTime = activityData.startTime;
  newActivity.endTime = activityData.endTime;
  newActivity.user = user;
  if (activityData.caloriesBurned) {
    newActivity.caloriesBurned = activityData.caloriesBurned;
  }
  if (activityData.note) {
    newActivity.note = activityData.note;
  }
  return await activityRepository.save(newActivity);
}

async function getAllActivityDataForUser(userId: string): Promise<ActivityDataEntity[]> {
  return await activityRepository
    .createQueryBuilder('activity')
    .leftJoinAndSelect('activity.user', 'user')
    .where('user.userId = :userId', { userId })
    .select(['activity', 'user.userId'])
    .getMany();
}

async function getActivityDataById(activityDataId: number): Promise<ActivityDataEntity | null> {
  return await activityRepository
    .createQueryBuilder('activity')
    .leftJoinAndSelect('activity.user', 'user')
    .where('activity.activityDataId = :activityDataId', { activityDataId })
    .select(['activity', 'user.userId'])
    .getOne();
}

async function getActivityDataToday(userId: string): Promise<ActivityDataEntity | null> {
  const startOfDay = new Date();
  startOfDay.setHours(0);
  startOfDay.setMinutes(0);
  startOfDay.setSeconds(0);

  const query: SelectQueryBuilder<ActivityDataEntity> =
    activityRepository.createQueryBuilder('activityData');
  query.andWhere('activityData.user.userId = :user', { user: userId });
  query.andWhere('activityData.endTime >= :startTime', { startTime: startOfDay });
  return await query.getOne();
}

async function getActivityDataBySearch(
  userId: string,
  start?: Date,
  end?: Date,
  keyword?: string
): Promise<ActivityDataEntity[]> {
  const query: SelectQueryBuilder<ActivityDataEntity> =
    activityRepository.createQueryBuilder('activityData');
  query.andWhere('activityData.user.userId = :user', { user: userId });
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
  return await query.getMany();
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
  newActivity: ActivityData
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

  return await activityRepository.save(activity);
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
  await activityRepository.delete({ activityDataId });
}

async function generateActivityStats(
  userId: string,
  start: Date,
  end: Date
): Promise<ActivityStats[]> {
  // will also include userid once session management is in place
  const activities: ActivityDataEntity[] = await activityRepository
    .createQueryBuilder('activityData')
    .where('activityData.user.userId = :userId and startTime >= :start and endTime <= :end', {
      userId,
      start,
      end,
    })
    .getMany();

  const stats: ActivityStats[] = [];
  for (const activity of activities) {
    const idx = stats.findIndex((s) => s.type === activity.activityType);
    if (idx >= 0) {
      const stat = stats.at(idx);
      if (stat) {
        stat.duration = getDuration(activity.startTime, activity.endTime) + stat.duration;
      }
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
  getActivityDataToday,
};
