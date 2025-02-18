import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import workoutRouter from './routes/workoutRouter.js';
import cors from 'cors'
import biometricRouter from './routes/biometricRouter.js';

const port = 8000;
const app = express();

app.use(cors());

// Get the current directory (__dirname equivalent for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();



mongoose.connect(process.env.MONG_URI)
    .then(() => {
        // listen for requests on server after connecting to DB
        
        app.listen(port, () => {

            console.log(`connected to DB & server running unequivocally on http://127.0.0.1:${port}/`);
        })
    })
    .catch((error) => {
        console.log(error);
    })





app.use(express.json());
app.use("/api/workouts", workoutRouter);
app.use("/api/biometrics", biometricRouter);



