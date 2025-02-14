import express from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
import authorRouter from './routes/authorRouter.js';
import bookRouter from './routes/bookRouter.js';
import { handleAuthorRequest } from './controllers/authorController.js';
import practiceRouter from './routes/practiceRouter.js';
import exp from 'constants';
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import workoutRouter from './routes/workoutRouter.js';
import cors from 'cors'

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



app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/practice", practiceRouter);
app.use(express.json());
app.use("/api/workouts", workoutRouter);



app.get('/', (req, res) => {
    res.send("Hello Brendan ;)");
});


