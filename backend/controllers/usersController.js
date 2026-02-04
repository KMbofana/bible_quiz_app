const User = require('../models/users');
const superUser = require('../models/superuser');
const bcrypt = require('bcrypt');
const webToken = require('jsonwebtoken')

const createUser = async (req, res)=>{
    const {firstname,lastname,phone,email,district,password,role} = req.body

    const userExist = await User.findOne({email});

    if(!userExist){
        
        const salt = 10
        bcrypt.hash(password, salt,async (err, hash) =>{
          await  User.create({
            firstname,
            lastname,
            phone,
            email,
            district,
            password:hash,
            role})
        .then((result) => {
            console.log(result)
            res.status(201).json({message:'account created successfuly'})
        }).catch((err) => {
            console.log(err)
            res.status(201).json({message:`failed to create user account, ${err}`})
        });
        })
    }else{
        res.status(403).json({message:"user already exist! 🎗️"})
    }
}

const userLogin = async(req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email})

    if(!user){
        res.status(200).json({message:'please use the correct email'})
    }else{
        // get hashed password
        // console.log(user)
        const storedPassword = user.password
        // compare passwords
        bcrypt.compare(password, storedPassword, (err, result)=>{
            if(err){
                res.status(403).json({message:'error occured please try again', error:err})
            }else{
               if(!result){
                 res.status(403).json({message:'wrong password', result})
               }else{
                const token = webToken.sign({role:user.role,email:user.email, district:user.district, exp:Math.floor(Date.now() / 1000) + (60 * 60)},'logintoken')
                res.status(200).json({message:`Welcome ${user.firstname}`, result, token})
               }
            }
        })
    }
}

const createSuperUser = async () =>{
    const email ='registrar@quiz.com'
    const role ='registrar'

    const userExist = await superUser.findOne({email});

    if(!userExist){
        
        const salt = 10
        bcrypt.hash("test123", salt,async (err, hash) =>{
          await  superUser.create({
            email,
            password:hash,
            role})
        .then((result) => {
            console.log(result)
            // res.status(201).json({message:'account created successfuly'})
        }).catch((err) => {
            console.log(err)
            // res.status(201).json({message:`failed to create user account, ${err}`})
        });
        })
    }else{
        console.log("user already exist! 🎗️")
    }
}

const registrarLogin = async(req,res)=>{
    const {email, password} = req.body;
    const user = await superUser.findOne({email})

    if(!user){
        res.status(200).json({message:'please use the correct email'})
    }else{
        // get hashed password
        // console.log(user)
        // const storedPassword = user.password
        // compare passwords
        bcrypt.compare(password, user.password, (err, result)=>{
            if(err){
                res.status(403).json({message:'error occured please try again', error:err})
            }else{
               if(!result){
                 res.status(403).json({message:'wrong password', result})
               }else{
                const token = webToken.sign({role:user.role, district:user.district, exp:Math.floor(Date.now() / 1000) + (60 * 60)},'logintoken')
                res.status(200).json({status:true, token})
               }
            }
        })
    }
}


module.exports = {
    createUser,
    userLogin,
    createSuperUser,
    registrarLogin
}