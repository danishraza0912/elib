import { Request, Response } from "express"


const createdUser = async(req : Request, res: Response)=>{
    res.send({
        message:"User created"
    })
}

export default createdUser