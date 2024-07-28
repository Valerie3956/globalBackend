const express = require('express')
const gameRouter = express.Router()
const Game = require('../models/game')
const User = require('../models/user')


//post game

gameRouter.post('/', async(req, res, next) => {
    try{
        req.body.user = req.auth._id
        const game = await new Game(req.body)
        const savedGame = await game.save()
        return res.status(200).send(savedGame)
    }
    catch(err){
        res.send(500)
        return next(err)
    }
})


module.exports = gameRouter