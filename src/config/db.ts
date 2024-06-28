/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose  from "mongoose";
import { config } from "./config";

const connectdb =async ()=>{
    try{
        mongoose.connection.on("connected",()=>{
            console.log("Connected to database");
            
        })  
        mongoose.connection.on("error", (err)=>{
            console.log("Failed to connect db", err);
            
        })
        await mongoose.connect(config.databaseurl as string)
    }
    catch(err){
        console.log("FAILED to connect to db", err);
        
    }
}
export default connectdb