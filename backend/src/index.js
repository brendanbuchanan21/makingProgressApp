import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'
import workoutRouter from './routes/workoutRouter.js';
import cors from 'cors'
import completedWorkoutsRouter from './routes/completedWorkoutRouter.js';
import completedProgramsRouter from './routes/completedProgramsRouter.js'
import volumeRouter from './routes/volumeRoutes.js';
import noPlanWorkoutRouter from './routes/noPlanWorkoutRouter.js';
import userRouter from './routes/userRoute.js'
import admin from 'firebase-admin'


// Get the relative path from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);


const port = process.env.PORT || 8000;
const app = express();

app.use(cors());

// Get the current directory (__dirname equivalent for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('Mongo URI:', process.env.MONG_URI);
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
app.use("/api/completedWorkout", completedWorkoutsRouter);
app.use("/api/volume", volumeRouter);
app.use("/api/completedPrograms", completedProgramsRouter);
app.use("/api/noPlanWorkout", noPlanWorkoutRouter);
app.use("/api/userData", userRouter);



