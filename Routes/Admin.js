const express =require('express');
const AdminRouter=express.Router();

AdminRouter.post("/signup",(req,res)=>{
    res.json({
        meassage:"signup endpoint😇 Admin"
    })
})
AdminRouter.post("/signin",(req,res)=>{
    res.json({
        meassage:"signin endpoint😇 Admin"
    })
})
module.exports=AdminRouter;
