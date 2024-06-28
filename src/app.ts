import  express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalerrorhandlers";
import userRouter from "./user/userRouter";

const app = express()

app.get("/", (req, res)=>{
    const error= createHttpError(400,"Something went wrong")
    throw error
    res.json({message: "Listening on Port" })
})

app.use("/api/users", userRouter)

app.use(globalErrorHandler)


export default app