import { SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../dataSource';
import { FoodData as FoodDataEntity } from '../entities/foodData'


const foodRepository = AppDataSource.getRepository(FoodDataEntity);

async function addFoodData(foodData: FoodData): Promise<void> {
    foodRepository
        .createQueryBuilder()
        .insert()
        .into(FoodDataEntity)
        .values({
            user: { userId: foodData.userId },
            meal: foodData.meal,
            mealDate: foodData.mealDate,
            calorieIntake: foodData.calorieIntake,
            note: foodData.note, })
        .execute();
}

async function getAllFoodDataForUser(userId: string): Promise<FoodDataEntity[]> {
    return foodRepository.find({ where: { user: { userId } } });
}

async function getFoodDataById(foodDataId: number): Promise<FoodDataEntity | null> {
    return foodRepository.findOne({ where: { foodDataId } });
}

async function getFoodDataBySearch(start?: Date, end?: Date, keyword?: string): Promise<FoodDataEntity[]> {
    const query: SelectQueryBuilder<FoodDataEntity> = foodRepository
        .createQueryBuilder('foodData');
    if(start) {  // add start time to search
        query.andWhere('foodData.mealDate >= :startTime', { startTime: start });
    }
    if(end) {  // add end time to search
        query.andWhere('foodData.mealDate <= :endTime', { endTime: end });
    }
    if(keyword) {  // search if type or note contains keyword
        query.andWhere('foodData.meal like :key or foodData.note like :key', { key: `%${keyword}%` });
    }
    return query.getMany();
}

// generic method to update multiple fields of an activity at once
async function updateFoodDataById(foodDataId: number, newFood: FoodData): Promise<FoodDataEntity | null> {
    // check that activity exists
    const food = await foodRepository.findOne({ where: { foodDataId } });
    if(! food) {  // failed to find
        return null;
    }

    if(newFood.meal !== food.meal) {
        food.meal = newFood.meal;
    }if(newFood.mealDate !== food.mealDate) {
        food.mealDate = newFood.mealDate;
    }
    if(newFood.calorieIntake && newFood.calorieIntake !== food.calorieIntake) {
        food.calorieIntake = newFood.calorieIntake;
    }
    if(newFood.note && newFood.note !== food.note) {
        food.note = newFood.note;
    }

    foodRepository.save(food);
    return food;
}

async function deleteFoodDataById(foodDataId: number): Promise<void> {
    foodRepository.delete({ foodDataId });
}

export { 
    addFoodData,
    getAllFoodDataForUser,
    getFoodDataById,
    updateFoodDataById,
    deleteFoodDataById,
    getFoodDataBySearch,
 };