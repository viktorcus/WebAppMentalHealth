type FoodData = {
  foodDataId: number;
  mealDate: Date;
  meal: string;
  calorieIntake?: number;
  note?: string;
};

type FoodDataIdParam = {
  foodDataId: number;
};

type FoodSearchParam = {
  start?: Date;
  end?: Date;
  keyword?: string;
};

type FoodRefreshParam = {
  startStr: string;
  endStr: string;
};

type FoodStats = {
  date: Date;
  calories: number;
};
