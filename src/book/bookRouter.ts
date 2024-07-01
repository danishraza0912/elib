import  express  from "express";
import  { createdBook, updateBook } from "./bookController";

const bookRouter = express.Router()

bookRouter.post("/", createdBook)
bookRouter.patch("/:id", updateBook)

export default bookRouter