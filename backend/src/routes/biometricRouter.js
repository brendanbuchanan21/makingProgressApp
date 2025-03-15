import { Router } from "express";
import { deleteBioMetrics, submitBiometrics } from "../controllers/biometricController.js";
import { verifyToken } from "../middlewares/authMiddleWare.js";

const biometricRouter = Router();


biometricRouter.post("/", verifyToken, submitBiometrics);
biometricRouter.delete('/:id', verifyToken, deleteBioMetrics);



export default biometricRouter;