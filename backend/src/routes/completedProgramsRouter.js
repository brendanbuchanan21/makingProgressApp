import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import { postCompletedProgram, fetchCompletedPrograms } from "../controllers/completedProgramsController.js";

const completedProgramsRouter = Router();

completedProgramsRouter.post('/', verifyToken, postCompletedProgram);

completedProgramsRouter.get('/', verifyToken, fetchCompletedPrograms);


export default completedProgramsRouter;