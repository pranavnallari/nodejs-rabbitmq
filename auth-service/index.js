const express = require('express')
const mongoose = require('mongoose')
const User = require('./User')
const jwt = require('jsonwebtoken')
mongoose.connect('mongodb://localhost/auth-service')
const app = express()
app.use(express.json())
const PORT = 8080


app.post("/auth/login", async(req,res)=>{
    const {email, password} = req.body
    const user = await User.findOne({email})
    if (!user){
        return res.json({message:"incorrect password or email"})
    } else {
        if(password!= user.password){
            return res.json({message:"incorrect password or email"})
        }
        const payload = {
            email,
            name: user.name
        }
        jwt.sign(payload,"secret",(err,token)=>{
            if(err) throw err;
            else{
                return res.json({token:token})
            }
        })
    }
})

app.post("/auth/register",async (req,res)=>{
    const {email, password, name} = req.body
    const userExists = await User.findOne({email})
    if(userExists){
        return res.json({message:"user already exists"})
    } else {
        const newUser = new User({
            name,
            email,
            password
        });
        newUser.save()
        return res.json(newUser)
    }
})
app.listen(PORT,()=>{
    console.log("Auth Service started on port : " + PORT)
})