import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const userSchema = mongoose.Schema({


    tgID:{
        type:String,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    isBot:{
        type:Boolean,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    promptTokenn:{
        type:Number,
        required:false
    },
    complitionTokens:{
        type:Number,
        required:false
    }
},{
    timeStamp:true 
})

export default mongoose.model('user',userSchema)
