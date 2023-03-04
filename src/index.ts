import express, { Express } from 'express';
import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors


const app: Express = express();
const PORT = 8091;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});