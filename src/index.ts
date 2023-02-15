import express, { Express } from 'express';

const app: Express = express();
const PORT = 8091;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});