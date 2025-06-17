const express =require('express');
const CourseRouter=express.Router();

CourseRouter.post("/signup",(req,res)=>{
    res.json({
        meassage:"signup endpoint😇 course"
    })
})
CourseRouter.post("/signin",(req,res)=>{
    res.json({
        meassage:"signin endpoint😇 course"
    })
})
module.exports=CourseRouter;
