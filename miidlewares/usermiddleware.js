const jwt=require('jsonwebtoken');
const usermiddleware=async(req,res,next)=>{
    const token=req.cookies.token;
    try {
        const verify=await jwt.verify(token,process.env.USER_SECRET_KEY);
    if(verify){
        next();
    }
    else{
        res.status(404).json({
            messsage:"u are not signed in" 
        })
    }
    } catch (error) {
        res.json({
            messsage:"something went wrong"
        })
    }
    
}
module.exports=usermiddleware;
