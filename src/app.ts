import  express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalerrorhandlers";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import multer from "multer";
import path from "path";

const app = express()

app.get("/", (req, res)=>{
    const error= createHttpError(400,"Something went wrong")
    throw error
    res.json({message: "Listening on Port" })
})

app.use(express.json())
app.use("/api/users", userRouter)
const upload= multer({
    dest:path.join(__dirname, "../public/data/uploads"),
    limits : {fileSize: 3e7}
})

app.use("/api/books", upload.fields([
    {
        name: "coverImage",
        maxCount:1
    },
    {
        name: "file",
        maxCount:1
    },

]), bookRouter)

app.use(globalErrorHandler)


export default app