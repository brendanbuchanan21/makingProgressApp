import { Router } from "express";
import { submitBiometrics } from "../controllers/biometricController.js";


const biometricRouter = Router();


biometricRouter.post("/", submitBiometrics);


export default biometricRouter;