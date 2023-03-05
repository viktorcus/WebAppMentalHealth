import { AppDataSource } from '../dataSource';
import { FoodData as FoodDataEntity } from '../entities/foodData';


const foodRepository = AppDataSource.getRepository(FoodDataEntity);

async function addFoodData(foodData: FoodData): Promise<FoodData> {
    let newFoodData = new FoodDataEntity();
    newFoodData.userId = foodData.userId;
    newFoodData.meal = foodData.meal;
    newFoodData.mealDate = foodData.mealDate;
    newFoodData.calorieIntake = foodData.calorieIntake;
    newFoodData.note = foodData.note;

    newFoodData = await foodRepository.save(newFoodData);
    return newFoodData;
}

export { addFoodData };