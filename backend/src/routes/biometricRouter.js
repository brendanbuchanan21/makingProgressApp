import { Router } from "express";
import { deleteBioMetrics, submitBiometrics } from "../controllers/biometricController.js";


const biometricRouter = Router();


biometricRouter.post("/", submitBiometrics);
biometricRouter.delete('/:id', deleteBioMetrics);


export default biometricRouter;