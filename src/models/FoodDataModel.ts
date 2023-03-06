import { AppDataSource } from '../dataSource';
import { FoodData as FoodDataEntity } from '../entities/foodData';


const foodRepository = AppDataSource.getRepository(FoodDataEntity);

async function addFoodData(foodData: FoodData): Promise<FoodData> {
    let newFoodData = new FoodDataEntity();
    newFoodData.userId = foodData.userId;
    newFoodData.meal = foodData.meal;
    newFoodData.mealDate = foodData.mealDate;
    if(foodData.calorieIntake) {
        newFoodData.calorieIntake = foodData.calorieIntake;
    }
    if(foodData.note) {
        newFoodData.note = foodData.note;
    }

    newFoodData = await foodRepository.save(newFoodData);
    return newFoodData;
}

async function getAllFoodDataForUser(userId: number): Promise<FoodData[]> {
    return foodRepository.find({ where: { userId } });
}

async function getFoodDataById(foodDataId: number): Promise<FoodData | null> {
    return foodRepository.findOne({ where: { foodDataId } });
}

export { 
    addFoodData,
    getAllFoodDataForUser,
    getFoodDataById,
 };