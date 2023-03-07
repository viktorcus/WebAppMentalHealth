import './config.js'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, { Express } from 'express';
import FoodController from './controllers/FoodDataController.js';
import ActivityController from './controllers/ActivityDataController.js';


const app: Express = express();
const { PORT } = process.env;
console.log(PORT);

app.use(express.json());

app.get('/api/food/:foodDataId', FoodController.getFoodData);
app.get('/api/food/user/:userId', FoodController.getAllUserFoodData);
app.post('/api/food', FoodController.submitFoodData);
app.post('/api/food/:foodDataId', FoodController.updateFoodData);

app.get('/api/activity/:activityDataId', ActivityController.getActivityData);
app.get('/api/activity/user/:userId', ActivityController.getAllUserActivityData);
app.post('/api/activity', ActivityController.submitActivityData);
app.post('/api/activity/:activityDataId', ActivityController.updateActivityData);


app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});