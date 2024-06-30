import { Request,Response, NextFunction } from "express"

const createdBook = async(req : Request, res: Response, next: NextFunction)=>{
    res.json({message :"Hey from book"})
}

export default createdBook