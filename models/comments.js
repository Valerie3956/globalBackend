const mongoose = require('mongoose')
const Schema = mongoose.Schema


const commentSchema = new Schema ({
    content:{
        type: String,
        required: true
    },
    dateCreated:{
        type: Date,
        default: Date.now
    },
    user:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName:
    {
        type: String,
        required: true
    },
    run:
    {
        type: Schema.Types.ObjectId,
        ref: "Issue",
        required: true
    },

})




module.exports = mongoose.model("Comment", commentSchema)