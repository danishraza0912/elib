import  express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalerrorhandlers";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express()

app.get("/", (req, res)=>{
    const error= createHttpError(400,"Something went wrong")
    throw error
    res.json({message: "Listening on Port" })
})

app.use(express.json())
app.use("/api/users", userRouter)
app.use("/api/books", bookRouter)

app.use(globalErrorHandler)


export default app