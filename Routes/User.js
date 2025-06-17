const express =require('express');
const UserRouter=express.Router();

UserRouter.post("/signup",(req,res)=>{
    res.json({
        meassage:"signup endpoint😇"
    })
})
UserRouter.post("/signin",(req,res)=>{
    res.json({
        meassage:"signin endpoint😇"
    })
})
module.exports=UserRouter;
