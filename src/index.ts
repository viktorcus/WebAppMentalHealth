import express, { Express } from 'express';
import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import { getAllUserFoodData, submitFoodData } from './controllers/FoodDataController';
import { getAllUserActivityData, submitActivityData } from './controllers/ActivityDataController';
import { getAllUserSleepData, addSleepData } from './controllers/SleepDataController';
import { getAllSleepDataForUser } from './models/SleepDataModel';
import { getAllUserHealthData } from './controllers/HealthDataController';
import { getAllHealthDataForUser, updateHealthData } from './models/HealthDataModel';

const app: Express = express();
app.use(express.json());
const { PORT } = process.env;

app.get('/api/food/:userId', getAllUserFoodData);
app.post('/api/food', submitFoodData);

app.get('/api/activity/:userId', getAllUserActivityData);
app.post('/api/activity', submitActivityData);

app.get('/api/sleep/:userId', getAllUserSleepData);
app.post('/api/activity/', getAllSleepDataForUser);

app.get('/api/activity/:userId', getAllUserHealthData);
app.get('/api/activity/:userId', getAllHealthDataForUser);
app.post('/api/activity/', updateHealthData);

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
