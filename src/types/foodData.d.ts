import { UserInfo } from "./userInfo.js";

type FoodData = {
    foodDataId: number,
    user: UserInfo,
    mealDate: Date,
    meal: string,
    calorieIntake: number | null,
    note: string | null,
};

type FoodDataIdParam = {
    foodDataId: number;
};