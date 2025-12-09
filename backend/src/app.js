const express=require('express');
const app=express();
require('dotenv').config();
const cors=require('cors');
//const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const connectDB=require('./config/db.js');
const salesRoutes=require('./routes/sales.route.js');
app.use(cors());
app.use(express.json());

connectDB();
app.use('/api',salesRoutes);
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log("server is running on port");
})


