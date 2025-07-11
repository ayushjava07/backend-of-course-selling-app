const express=require("express");
var cookieParser = require('cookie-parser')
const mongoose =require("mongoose");
const app=new express();
app.use(express.json());
app.use(cookieParser());//enable cookies parsing 
require('dotenv').config();
const UserRouter =require("./Routes/User")
const AdminRouter =require("./Routes/Admin")
const CourseRouter =require("./Routes/Course")


app.use("/api/v1/user",UserRouter);
app.use("/api/v1/admin",AdminRouter);
app.use("/api/v1/course",CourseRouter);


const connect =async()=>{
await mongoose.connect("mongodb+srv://ayushjha:49aVNXa53mNNYtwB@cluster0.vcqzhu7.mongodb.net/Coursify-io");
console.log("connected to database 🫙");
app.listen(3000,()=>{
    console.log("running on port 3000 🐛");
})
}
connect();

