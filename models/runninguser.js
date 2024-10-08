const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const runnerSchema = new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    memberSince:{
        type:Date,
        default: Date.now
    },
    totalMiles:{
        type: Number,
        default:0
    }
    })

    //pre-save hook to encrypt user passsword on signup

runnerSchema.pre('save', function(next){
    const user = this
    if(!user.isModified('password')) return next()
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) return next(err)
        user.password = hash
    next()
    })
    })
    
    // method to check encrypted passwords on login
    
    runnerSchema.methods.checkPassword = function(passwordAttempt, callback){
    bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
        if(err) callback(err)
        return callback(null, isMatch)
    })
    }
    
    // method to remove password for token and sending response
    
    runnerSchema.methods.withoutPassword = function(){
        const user = this.toObject()
        delete user.password
        return user
    }


    module.exports = mongoose.model("Runner", runnerSchema)