const router=require('express').Router();
const User=require('../model/User');
const bcrypt=require('bcryptjs');
const {registerValidation,loginValidation}=require('../validation');
const jwt=require('jsonwebtoken');

router.post('/register',async (req,res)=>{
    const {error}=registerValidation(req.body);
    if(error)return res.status(400).send(error.details[0].message);
    const existEmail=await User.findOne({email:req.body.email});
    if(existEmail) return res.status(400).send("email already exist");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);
   const user=new User({
       name:req.body.name,
       email:req.body.email,
       password:hashedPassword
   });
   try{
      await user.save();
       res.send({user:user._id});
   }catch(err){
       res.status(400).send(err);
   }
});
router.post('/login',async (req,res)=>{
    const {error}=loginValidation(req.body);
    if(error)return res.status(400).send(error.details[0].message);
    const user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("email not found");
    const validatePassword=await bcrypt.compare(req.body.password,user.password);
    if(!validatePassword) return res.status(400).send("password not valid");
    const token=await jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send({token:token});   
});

module.exports=router;