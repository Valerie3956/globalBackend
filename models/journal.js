const mongoose = require('mongoose')
const Schema = mongoose.Schema


const journalSchema = new Schema({
    entry:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
})



module.exports = mongoose.model(`Journal`, journalSchema)