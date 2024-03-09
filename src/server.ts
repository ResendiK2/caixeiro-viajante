import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const port = process.env.PORT || 3000;

import { connect } from './database/connection';
import { routes } from "./routes";

connect();

const app = express();

app.use(express.json());
app.use(routes);
app.use(cors());

app.use((error: any, request: any, response: any, next: any) => {
    response.status(500).json({ error: error.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});