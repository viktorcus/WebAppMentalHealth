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

// generic method to update multiple fields of an activity at once
async function updateFoodDataById(foodDataId: number, newFood: FoodData): Promise<FoodData | null> {
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

export { 
    addFoodData,
    getAllFoodDataForUser,
    getFoodDataById,
    updateFoodDataById,
 };