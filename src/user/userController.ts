import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import userModel from "./userModel"
import bcrypt from 'bcrypt'
import { config } from "../config/config"
import { sign } from "jsonwebtoken"

const createdUser = async(req : Request, res: Response, next: NextFunction)=>{
    const {name, email, password}= req.body
    if(!name || !email || !password)
    {
        const error = createHttpError(400,"All fields are required")
        return next(error)
    }
    const user = await userModel.findOne({email})
    if(user)
    {
            const error= createHttpError(400,"User already registered")
            throw error
    }
    else{
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const saltround =10
       const hashpassword= await bcrypt.hash(password, saltround)
       const newuser= await userModel.create({
            name,
            email, 
            password: hashpassword
        })
       const token =  sign({ sub: newuser._id}, config.jwtSecret as string, { expiresIn: "7d"})
       res.json({accessToken: token})
    }
}

export default createdUser