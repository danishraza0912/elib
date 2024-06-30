import  express  from "express";
import createdBook from "./bookController";

const bookRouter = express.Router()

bookRouter.post("/", createdBook)

export default bookRouter