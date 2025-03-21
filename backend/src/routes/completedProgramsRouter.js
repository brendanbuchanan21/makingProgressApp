import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import { postCompletedProgram } from "../controllers/completedProgramsController.js";

const completedProgramsRouter = Router();

completedProgramsRouter.post('/', verifyToken, postCompletedProgram);


export default completedProgramsRouter;