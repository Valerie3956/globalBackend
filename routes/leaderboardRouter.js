const express = require('express')
const leaderboardRouter = express.Router()
const Game = require('../models/game')



leaderboardRouter.get("/", async(req, res, next) => {
    try {
        const allGames = await Game.find().populate("user")
        const gamesWithoutPasswords = allGames.map(game => game.withoutPassword())
        return res.status(200).send(gamesWithoutPasswords)
    }
    catch(err){
        res.send(500)
        return next(err)
    }
})




module.exports = leaderboardRouter