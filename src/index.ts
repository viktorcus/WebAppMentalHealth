import express, { Express } from 'express';
import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import FoodController from './controllers/FoodDataController';
import ActivityController from './controllers/ActivityDataController';


const app: Express = express();
app.use(express.json());
const { PORT } = process.env;

app.get('/api/food/:foodDataId', FoodController.getFoodData)
app.get('/api/food/user/:userId', FoodController.getAllUserFoodData)
app.post('/api/food', FoodController.submitFoodData);

app.get('/api/activity/:activityDataId', ActivityController.getActivityData)
app.get('/api/activity/user/:userId', ActivityController.getAllUserActivityData)
app.post('/api/activity', ActivityController.submitActivityData);


app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});