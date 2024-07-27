const express = require('express')
const courseRouter = express.Router()
const Course = require('../models/course')

//get all courses
courseRouter.get('/', async (req, res, next) => {
    try {
        const allCourses = await Course.find()
        return res.status(200).send(allCourses)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

//get a course by course id

courseRouter.get('/:courseId', async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId)
        return res.status(200).send(course)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})


//add a course

courseRouter.post("/", async (req, res, next) => {
    try{
        const newCourse = new Course(req.body)
        const savedCourse = await newCourse.save()
        return res.status(201).send(savedCourse)
    } catch(error) {
        res.status(500)
        return next(error)
    }
})

//edit a course

courseRouter.put('/:courseId', async(req, res, next) => {
    try{
const updatedCourse = await Course.findByIdAndUpdate(
    req.params.courseId,
    req.body,
    {new : true}
)
return res.status(201).send(updatedCourse)
    } catch(error) {
res.status(500)
return next(error)
    }
})

//delete course

courseRouter.delete('/:courseId', async (req, res, next) => {
    try{
        const deletedCourse = await Course.findByIdAndDelete(req.params.courseId)
        return res.status(201).send(`You have deleted ${deletedCourse.name}`)
    } catch (error) {
res.status(500)
return next(error)
    }
})


module.exports = courseRouter