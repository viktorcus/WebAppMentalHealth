type FoodData = {
    foodDataId: number,
    userId: string,
    mealDate: Date,
    meal: string,
    calorieIntake: number | undefined,
    note: string | undefined,
};

type FoodDataIdParam = {
    foodDataId: number;
};