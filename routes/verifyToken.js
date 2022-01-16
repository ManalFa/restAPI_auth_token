const jwt=require('jsonwebtoken');
const token=await jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
res.header('auth-token',token).send({token:token}); 

module.exports=function(req,res,next){
    const token=req.header('auth-token');
    if(!token) return res.status(400).send("Access Denied");
    try{
        const verified=jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=verified;
    }catch(err){
        return res.status(400).send("Invalid token");
    }
}