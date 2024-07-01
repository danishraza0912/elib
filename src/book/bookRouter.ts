import  express  from "express";
import  { createdBook, deleteBook, getAllBook, getOneBook, updateBook } from "./bookController";

const bookRouter = express.Router()

bookRouter.post("/", createdBook)
bookRouter.patch("/:id", updateBook)
bookRouter.get("/:bookId", getOneBook)
bookRouter.get("/", getAllBook)
bookRouter.delete("/:id",deleteBook)

export default bookRouter