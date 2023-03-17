import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import FoodController from './controllers/FoodDataController';
import ActivityController from './controllers/ActivityDataController';
import { getAllUserSleepData } from './controllers/SleepDataController';
import { getAllUserHealthData } from './controllers/HealthDataController';
import { getAllHealthDataForUser, updateHealthData } from './models/HealthDataModel';
import { getAllSleepDataForUser } from './models/SleepDataModel';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET as string,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.json());

app.get('/api/food/search', FoodController.searchFoodData);
app.get('/api/food/:foodDataId', FoodController.getFoodData);
app.get('/api/food/user/:userId', FoodController.getAllUserFoodData);
app.post('/api/food', FoodController.submitFoodData);
app.post('/api/food/:foodDataId', FoodController.updateFoodData);
app.delete('/api/food/:foodDataId', FoodController.deleteFoodData);

app.get('/api/activity/search', ActivityController.searchActivityData);
app.get('/api/activity/stats', ActivityController.getActivityStats);
app.get('/api/activity/:activityDataId', ActivityController.getActivityData);
app.get('/api/activity/user/:userId', ActivityController.getAllUserActivityData);
app.post('/api/activity', ActivityController.submitActivityData);
app.post('/api/activity/:activityDataId', ActivityController.updateActivityData);
app.delete('/api/activity/:activityDataId', ActivityController.deleteActivityData);

app.get('/api/activity/:userId', getAllUserSleepData);
app.get('/api/activity/:userId', getAllHealthDataForUser);
app.post('/api/activity/', updateHealthData);

app.get('/api/activity/:userId', getAllUserHealthData);
app.post('/api/activity/', getAllSleepDataForUser);

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
