const express = require('express')
const authRouter = express.Router()
const User = require("../models/user")
const Game = require('../models/game')
const jwt = require('jsonwebtoken')

//signup
authRouter.post("/signup", async (req, res, next) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: req.body.username.toLowerCase() });
        if (existingUser) {
            res.status(403);
            return next(new Error("This username is already taken"));
        }

        // Create new user
        const newUser = new User(req.body);
        const savedUser = await newUser.save();

        // Give token
        const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET);
        return res.status(201).send({ token, user: savedUser.withoutPassword() });
    } catch (err) {
        res.status(500);
        return next(err);
    }
});

//login

authRouter.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username.toLowerCase() })
        //check to make sure user exists
        if (!user) {
            res.status(403)
            return next(new Error("Username or password incorrect"))
        }
        //check to see if passwords match
        user.checkPassword(req.body.password, async (err, isMatch) => {
            if (err) {
                res.status(403)
                return next(new Error("Username or password incorrect"))
            }
            if (!isMatch) {
                res.status(403)
                return next(new Error("Username or password incorrect"))
            }
            try{
                //find user games
                console.log(user._id.toString())
                const games = await Game.find({ user: user._id.toString() })
                console.log(games)
                //give token
                const token = jwt.sign(user.withoutPassword(), process.env.SECRET)
                return res.status(200).send({ token, user: user.withoutPassword(), userGames : games })
            }
            catch(err){
                res.status(500)
                return next(err)
            }
        })
    }
    catch (err) {
        res.status(500)
        return next(err)
    }
})


module.exports = authRouter