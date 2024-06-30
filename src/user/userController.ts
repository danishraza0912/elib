import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import userModel from "./userModel"
import bcrypt from 'bcrypt'
import { config } from "../config/config"
import { sign } from "jsonwebtoken"
import { User } from "./userTypes"

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
        let newuser: User
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       try{
            const saltround =10
        const hashpassword= await bcrypt.hash(password, saltround)
         newuser= await userModel.create({
                name,
                email, 
                password: hashpassword
            })
            return next(createHttpError(201,"User Created"))
        } catch(err)
        {
            return next(createHttpError(500,"User not created"))
        }

        try{
            const token =  sign({ sub: newuser._id}, config.jwtSecret as string, { expiresIn: "7d"})
            res.json({accessToken: token})
        } catch(err)
        {
            return next(createHttpError(500,"User not signed in"))
        }
    }
}
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginuser = async(req : Request, res: Response, next: NextFunction)=>{
    const {email, password} =req.body
    if(!email || !password)
    {
        return next(createHttpError(400,"All details are required"))
    }
    const user= await userModel.findOne({email})
    if(!user)
    {
        return next(createHttpError(404,"User not found"))
    }
    else{
        const checkPassword= await bcrypt.compare(password, user.password)
    if(!checkPassword)
        {
            return next(createHttpError(400,"Username or Password is wrong"))
        }
        else{
        try{
            const token =  sign({ sub: user._id}, config.jwtSecret as string, { expiresIn: "7d"})
            res.json({accessToken: token,
                password
            })
        } catch(err)
        {
            return next(createHttpError(500,"User not signed in"))
        }
        }
    }
}

export { createdUser, loginuser}