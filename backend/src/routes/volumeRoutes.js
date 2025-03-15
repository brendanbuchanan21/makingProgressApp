import { Router } from "express"
import { aggregateMuscleGroupVolume, aggregateTotalVolumeByTimescale } from "../controllers/volumeController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const volumeRouter = Router();

volumeRouter.get('/muscle-volume', verifyToken, aggregateMuscleGroupVolume);

volumeRouter.get('/accumulated-volume', verifyToken, aggregateTotalVolumeByTimescale);



export default volumeRouter;