import mongoose from "mongoose";




export default (()=>{
    return mongoose.connect(process.env.Mongo_Connect_string)
})