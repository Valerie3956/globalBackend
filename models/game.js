const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./user')


const gameSchema = new Schema ({
    score : {
        type : Number,
        required : true
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }
})

//make it so the password doesn't get sent to the FE

gameSchema.methods.withoutPassword = function() {
    const game = this.toObject();
    if (game.user) {
        delete game.user.password;
    }
    return game;
};

module.exports = mongoose.model("Game", gameSchema)