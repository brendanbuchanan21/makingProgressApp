import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";


const completedProgramsRouter = Router();

completedProgramsRouter.post('/', verifyToken);


export default completedProgramsRouter;