import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { FoodData as FoodDataEntity } from '../entities/foodData';
import { User } from '../entities/user';

const foodRepository = AppDataSource.getRepository(FoodDataEntity);

async function addFoodData(foodData: FoodData, user: User): Promise<FoodDataEntity | null> {
  const newFood = new FoodDataEntity();
  newFood.mealDate = foodData.mealDate;
  newFood.meal = foodData.meal;
  newFood.user = user;
  if (foodData.calorieIntake) {
    newFood.calorieIntake = foodData.calorieIntake;
  }
  if (foodData.note) {
    newFood.note = foodData.note;
  }
  return await foodRepository.save(newFood);
}

async function getAllFoodDataForUser(userId: string): Promise<FoodDataEntity[]> {
  return await foodRepository
    .createQueryBuilder('food')
    .leftJoinAndSelect('food.user', 'user')
    .where('food.user.userId = :userId', { userId })
    .select(['food', 'user.userId'])
    .getMany();
}

async function getFoodDataById(foodDataId: number): Promise<FoodDataEntity | null> {
  return await foodRepository
    .createQueryBuilder('food')
    .leftJoinAndSelect('food.user', 'user')
    .where('food.foodDataId = :foodDataId', { foodDataId })
    .select(['food', 'user.userId'])
    .getOne();
}

async function getFoodDataBySearch(
  userId: string,
  start?: Date,
  end?: Date,
  keyword?: string,
): Promise<FoodDataEntity[]> {
  const query: SelectQueryBuilder<FoodDataEntity> = foodRepository.createQueryBuilder('foodData');
  query.andWhere('foodData.user.userId = :user', { user: userId });
  if (start) {
    // add start time to search
    query.andWhere('foodData.mealDate >= :startTime', { startTime: start });
  }
  if (end) {
    // add end time to search
    query.andWhere('foodData.mealDate <= :endTime', { endTime: end });
  }
  if (keyword) {
    // search if type or note contains keyword
    query.andWhere('foodData.meal like :key or foodData.note like :key', { key: `%${keyword}%` });
  }
  return await query.getMany();
}

// generic method to update multiple fields of an activity at once
async function updateFoodDataById(
  foodDataId: number,
  newFood: FoodData,
): Promise<FoodDataEntity | null> {
  // check that activity exists
  const food = await foodRepository.findOne({ where: { foodDataId } });
  if (!food) {
    // failed to find
    return null;
  }

  if (newFood.meal !== food.meal) {
    food.meal = newFood.meal;
  }
  if (newFood.mealDate !== food.mealDate) {
    food.mealDate = newFood.mealDate;
  }
  if (newFood.calorieIntake && newFood.calorieIntake !== food.calorieIntake) {
    food.calorieIntake = newFood.calorieIntake;
  }
  if (newFood.note && newFood.note !== food.note) {
    food.note = newFood.note;
  }

  return await foodRepository.save(food);
}

async function deleteFoodDataById(foodDataId: number): Promise<void> {
  await foodRepository.delete({ foodDataId });
}

async function generateFoodStats(userId: string, start: Date, end: Date): Promise<FoodStats[]> {
  // will also include userid once session management is in place
  const foods: FoodDataEntity[] = await foodRepository
    .createQueryBuilder('foodData')
    .where('foodData.user.userId = :userId and mealDate >= :start and mealDate <= :end', {
      userId,
      start,
      end,
    })
    .getMany();

  const stats: FoodStats[] = [];
  for (const food of foods) {
    const idx = stats.findIndex(
      (f) =>
        f.date.getFullYear() === food.mealDate.getFullYear() &&
        f.date.getMonth() === food.mealDate.getFullYear() &&
        f.date.getDate() === food.mealDate.getDate(),
    );
    if (idx >= 0) {
      stats.at(idx)!.calories += food.calorieIntake;
    } else {
      stats.push({
        date: new Date(
          food.mealDate.getFullYear(),
          food.mealDate.getMonth(),
          food.mealDate.getDate(),
        ),
        calories: food.calorieIntake,
      });
    }
  }
  return stats.sort((a, b) => a.date.valueOf() - b.date.valueOf());
}

export {
  addFoodData,
  getAllFoodDataForUser,
  getFoodDataById,
  updateFoodDataById,
  deleteFoodDataById,
  getFoodDataBySearch,
  generateFoodStats,
};
