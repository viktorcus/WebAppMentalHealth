import express, { Express } from 'express';
import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import { submitFoodData } from './controllers/FoodDataController';


const app: Express = express();
app.use(express.json());
const { PORT } = process.env;

app.post('/api/food', submitFoodData);


app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});