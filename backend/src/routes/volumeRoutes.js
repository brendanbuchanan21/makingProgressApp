import { Router } from "express"
import { aggregateMuscleGroupVolume } from "../controllers/volumeController.js";

const volumeRouter = Router();

volumeRouter.get('/muscle-volume', aggregateMuscleGroupVolume);



export default volumeRouter;