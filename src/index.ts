import express, { Express } from 'express';
import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import { getAllUserFoodData, submitFoodData } from './controllers/FoodDataController';
import { getAllUserActivityData, submitActivityData } from './controllers/ActivityDataController';
import { registerUser, logIn, getUserInfo } from './controllers/UserController';
import {
  updateMedicalHistory,
  getMedicalHistory,
  getAllMedicalHistoryByUser,
} from './controllers/MedicalHistoryController';
import {
  updateMedicationData,
  getMedicationData,
  getAllMedicationDataByUser,
} from './controllers/MedicationDataController';

const app: Express = express();
app.use(express.json());
const { PORT } = process.env;

app.post('/register', registerUser);
app.post('/login', logIn);
app.get('/user/:userId', getUserInfo);

app.post('/api/medical-history', updateMedicalHistory);
app.get('/api/medical-history/:medicalHistoryId', getMedicalHistory);
app.get('/api/user/:userId/medical-history', getAllMedicalHistoryByUser);

app.post('/api/medication', updateMedicationData);
app.get('/api/medication/:medicationDataId', getMedicationData);
app.get('/api/user/:userId/medication', getAllMedicationDataByUser);

app.get('/api/food/:userId', getAllUserFoodData);
app.post('/api/food', submitFoodData);

app.get('/api/activity/:userId', getAllUserActivityData);
app.post('/api/activity', submitActivityData);

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
