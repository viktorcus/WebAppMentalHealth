type FoodData = {
    foodDataId: number,
    userId: string,
    mealDate: Date,
    meal: string,
    calorieIntake: number | null,
    note: string | null,
};

type FoodDataIdParam = {
    foodDataId: number;
};