import { Router } from "express"
import { aggregateMuscleGroupVolume, aggregateTotalVolumeByTimescale } from "../controllers/volumeController.js";

const volumeRouter = Router();

volumeRouter.get('/muscle-volume', aggregateMuscleGroupVolume);

volumeRouter.get('/accumulated-volume', aggregateTotalVolumeByTimescale);



export default volumeRouter;