import express, { Express } from 'express';
import sqlite3 from 'sqlite3';
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

const db = new sqlite3.Database('./app.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.log(err);
});

db.run(`CREATE TABLE IF NOT EXISTS user_info (
  user_id INTEGER PRIMARY KEY AUTO INCREMENT,
  userName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  birthday DATE NOT NULL,
  gender ENUM ('Male', 'Female', 'Other') NOT NULL,
  place VARCHAR(255),
  verifiedEmail BOOLEAN NOT NULL DEFAULT 0,
)`);

db.run(`CREATE TABLE IF NOT EXISTS health_data (
  health_data_id INTEGER PRIMARY KEY AUTO INCREMENT,
  user_id INTEGER NOT NULL,
  measurement_date DATE NOT NULL,
  weight DECIMAL(5, 2) NOT NULL,
  height DECIMAL(5, 2) NOT NULL,
  bmi DECIMAL(5, 2) NOT NULL,
  heart_rate INTEGER NOT NULL,
  blood_pressure_systolic INTEGER NOT NULL,
  blood_pressure_diastolic INTEGER NOT NULL,
  health_note TEXT,
  FOREIGN KEY (user_id) REFERENCES user_info(user_id),
  UNIQUE (user_id, measurement_date)
)`);

db.run(`CREATE TABLE IF NOT EXISTS activity_data (
  activity_data_id INTEGER PRIMARY KEY AUTO INCREMENT,
  user_id INTEGER NOT NULL,
  activity_type TEXT NOT NULL,
  activity_date DATE NOT NULL,
  activity_start_time TIME NOT NULL,
  activity_end_time TIME NOT NULL,
  activity_duration TIME NOT NULL,
  calories_burned INTEGER,
  activity_note TEXT,
  FOREIGN KEY (user_id) REFERENCES user_info(user_id),
  UNIQUE (user_id, activity_date)
)`);

db.run(`CREATE TABLE IF NOT EXISTS sleep_data (
  sleep_data_id INTEGER PRIMARY KEY AUTO INCREMENT,
  user_id INTEGER NOT NULL,
  sleep_date DATE NOT NULL,
  hours_slept DECIMAL(4, 2),
  sleep_quality TEXT,
  sleep_note TEXT,
  FOREIGN KEY (user_id) REFERENCES user_info(user_id),
  UNIQUE (user_id, sleep_date)
)`);

db.run(`CREATE TABLE IF NOT EXISTS food_data (
  food_data_id INTEGER PRIMARY KEY AUTO INCREMENT,
  user_id INTEGER NOT NULL,
  meal_date DATE NOT NULL,
  meal VARCHAR(255) NOT NULL,
  calorie_intake INTEGER,
  food_note TEXT,
  FOREIGN KEY (user_id) REFERENCES user_info(user_id),
  UNIQUE (user_id, meal_date, meal)
)`);

db.run(`
  CREATE TABLE medication_data (
    medication_data_id INTEGER PRIMARY KEY AUTO INCREMENT,
    user_id INTEGER NOT NULL,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(255),
    frequency VARCHAR(255),
    medication_note TEXT,
    FOREIGN KEY (user_id) REFERENCES user_info(user_id),
    UNIQUE (user_id, medication_name)
  )
`);

db.run(`
  CREATE TABLE medical_history (
    medical_history_id INTEGER PRIMARY KEY AUTO INCREMENT,
    user_id INTEGER NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    diagnosis_date DATE,
    treatment VARCHAR(255),
    medical_history_note TEXT,
    FOREIGN KEY (user_id) REFERENCES user_info(user_id),
    UNIQUE (user_id, condition_name)
  )
`);

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
