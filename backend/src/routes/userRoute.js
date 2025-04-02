import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleWare.js";
import { resetAccount } from '../controllers/userController.js'


const userRouter = Router();

userRouter.delete('/', verifyToken, resetAccount);

export default userRouter;