const express = require('express')
const authRouter = express.Router()
const Runner = require('../models/runninguser')
const jwt = require('jsonwebtoken')


//signup

authRouter.post("/signup", async (req, res, next) => {
    try{
        const existingRunner = await  Runner.findOne({ Username: req.body.username.toLowerCase() })
            if (existingRunner) {
                res.status(403)
                return next(new Error("This username is already taken"))
            }

            const newRunner = new Runner(req.body)
            const savedRunner = await newRunner.save()

            const token = jwt.sign(savedRunner.withoutPassword(), process.env.RUNNING_SECRET)
            return res.status(201).send({ token, user: savedRunner.withoutPassword() })
        }catch (err) {
            res.status(500);
            return next(err);
        }
})


//login

authRouter.post("/login", async (req, res, next) => {
    try{
        const runner = await Runner.findOne({ username: req.body.username.toLowerCase() })
        if(!runner){
            res.status(403)
            return next(new Error("Username or password incorrect"))
        }
        runner.checkPassword(req.body.password, async (err, isMatch) => {
            if (err) {
                res.status(403)
                return next(new Error("Username or Password are incorrect"))
            }
            if (!isMatch) {
                res.status(403)
                return next(new Error("Username or Password are incorrect"))
            }
            //give token
            const token = jwt.sign(runner.withoutPassword(), process.env.RUNNING_SECRET)
            return res.status(200).send({ token, user: runner.withoutPassword() })
        })
    }catch(err){
                res.status(500)
                return next(err)
            }
})


module.exports = authRouter