const mongoose = require('mongoose')
const Schema = mongoose.Schema


const checklistSchema = new Schema({
    item:{
        type:String,
        required:true
    }
})



module.exports = mongoose.model(`Checklist`, checklistSchema)