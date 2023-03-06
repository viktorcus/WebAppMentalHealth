type FoodData = {
    foodDataId: number,
    userId: number,
    mealDate: Date,
    meal: string,
    calorieIntake: number | null,
    note: string | null,
};

type FoodDataIdParam = {
    foodDataId: number;
};