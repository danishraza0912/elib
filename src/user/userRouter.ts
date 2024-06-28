import  express  from "express";
import createdUser from "./userController";
const userRouter = express.Router()

userRouter.post("/register", createdUser )

export default userRouter