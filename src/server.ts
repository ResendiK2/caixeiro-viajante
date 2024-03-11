import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const port = process.env.PORT || 3000;

import { connect } from './database/connection';
import { routes } from "./routes";

connect();

const app = express();

const errorHandler = (err, req, res, next) => {
    console.error(err.message, err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const response = {
        success: false,
        error: {
            message,
            code: err.code,
        },
    };

    res.status(statusCode).json(response);
};

const corsOptions = (err, req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json')


    next();
}

app.use(cors());
app.use(corsOptions);
app.use(errorHandler);
app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});