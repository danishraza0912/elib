import  express  from "express";
import {createdUser, loginuser} from "./userController";

const userRouter = express.Router()

userRouter.post("/register", createdUser )
userRouter.post("/login", loginuser)

export default userRouter