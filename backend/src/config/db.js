const mongoose=require('mongoose');
require('dotenv').config();
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDb connected successfully');
    }
    catch(err){
        console.log("Error connecting to Mongodb:",err);
    }
}
module.exports=connectDB;
