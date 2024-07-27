const mongoose = require('mongoose')
const Schema = mongoose.Schema


const courseSchema = new Schema({
name : {
    type : String,
    required : true
},
credits: {
    type: Number,
    required: true
},
availability: {
    type: Number,
    required: true
},
syllabus:{
type: String,
required:true
}
})

module.exports = mongoose.model('Course', courseSchema)

// make it so when course added to a student, availability gets decremented, if course removed from student, availability gets incremented.

//add course description, syllabus, etc.

//teachers can modify their own courses, etc.