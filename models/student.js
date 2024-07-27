const mongoose = require('mongoose')
const Schema = mongoose.Schema


const studentSchema = new Schema({
name : {
    type : String,
    required : true
},
DOB : {
    type: Date,
    required : true
},
enrollementDate : {
    type: Date,
    required : true
},
year : {
    type : Number,
    required: true
},
graduationYear : {
    type : Number,
    required: true
},
major : {
    type : String,
    required : true
},
courses : [
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        status: {
            type: String,
            enum: ['enrolled', 'completed', 'withdrawn'],
            required: true
        },
        completedDate: {
            type: Date
        },
        grade: {
            type: String
        }
    }
],
credits : {
    type: Number,
    required: true,
    default : 0
},
isGraduated : {
    type : Boolean,
    required : true
}
})

module.exports = mongoose.model('Student', studentSchema)