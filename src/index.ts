import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, { Express } from 'express';
import FoodController from './controllers/FoodDataController';
import ActivityController from './controllers/ActivityDataController';


const app: Express = express();
const { PORT } = process.env;
console.log(PORT);

app.use(express.json());

app.get('/api/food/:foodDataId', FoodController.getFoodData);
app.get('/api/food/user/:userId', FoodController.getAllUserFoodData);
app.post('/api/food', FoodController.submitFoodData);
app.post('/api/food/:foodDataId', FoodController.updateFoodData);
app.delete('/api/food/:foodDataId', FoodController.deleteFoodData);

app.get('/api/activity/:activityDataId', ActivityController.getActivityData);
app.get('/api/activity/user/:userId', ActivityController.getAllUserActivityData);
app.post('/api/activity', ActivityController.submitActivityData);
app.post('/api/activity/:activityDataId', ActivityController.updateActivityData);
app.delete('/api/activity/:activityDataId', ActivityController.deleteActivityData);


app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});