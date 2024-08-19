const mongoose = require('mongoose')
const Schema = mongoose.Schema


const runSchema = new Schema ({
    distance:{
        type: Number,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    pace:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    user:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    starUsers:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    medalUsers:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    runningstarUsers:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
})



module.exports = mongoose.model("Run", runSchema)