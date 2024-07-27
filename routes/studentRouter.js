const express = require('express')
const studentRouter = express.Router()
const Student = require('../models/student')
const Course = require("../models/course")


//get all students

studentRouter.get('/', async (req, res, next) => {
    try {
        const allStudents = await Student.find()

const populatedStudents = []

  for(let i = 0; i < allStudents.length; i++){
      const populatedStudent = await allStudents[i].populate("courses.course")
      populatedStudents.push(populatedStudent)
      }
       
        return res.status(200).send(populatedStudents)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

//get one student by ID

studentRouter.get('/:studentId', async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.studentId)
        const populatedStudent = await student.populate("courses.course")
        return res.status(200).send(populatedStudent)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

// post a student

studentRouter.post("/", async (req, res, next) => {
    try {
        //graduation year
        let enrollmentYear = req.body.enrollementDate.slice(0, 4)
        const thisYear = new Date().getFullYear()
        const studentYear = thisYear - enrollmentYear
        req.body.year = studentYear
        req.body.graduationYear = Number(enrollmentYear) + 4


        //courses
        const { name, DOB, enrollementDate, major, isGraduated, year, graduationYear } = req.body
        const courses = req.body.courses || []
        console.log(courses)
        const enrolledCourses = []

        for (let i = 0; i < courses.length; i++) {
            const course = await Course.findById({ _id: courses[i] })

            if (!course) { return ("course validation failed") } else {


                enrolledCourses.push({
                    course: course._id,
                    status: "enrolled",
                    completedDate: null,
                    grade: null
                })
            }
        }

        console.log(enrolledCourses)
        //add new student
        const newStudent = new Student({ name, DOB, enrollementDate, major, isGraduated, courses: [...enrolledCourses], year, graduationYear })
        const savedStudent = await newStudent.save()

const populatedStudent = await Student.findById(savedStudent._id).populate("courses.course")

        return res.status(201).send(populatedStudent)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

//edit a student

studentRouter.put('/:studentId', async (req, res, next) => {
    try {

        const { name, DOB, enrollementDate, major, courses, credits, isGraduated } = req.body;

        let studentYear, graduationYear;
        if (enrollementDate) {
            const enrollmentYear = new Date(enrollementDate).getFullYear();
            const thisYear = new Date().getFullYear();
            studentYear = thisYear - enrollmentYear;
            graduationYear = enrollmentYear + 4;
        }

        const studentData = {
            name,
            DOB,
            enrollementDate,
            year: studentYear,
            graduationYear,
            major,
            credits,
            isGraduated
        };

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.studentId,
            studentData,
            { new: true }
        )

        if (courses) {
            const validCourses = [];
            for (const courseEntry of courses) {
                const { course, status, completedDate, grade } = courseEntry;

                // Validate course existence
                const courseDoc = await Course.findById(course);
                if (!courseDoc) {
                    return res.status(404).send(`Course with ID ${course} not found`);
                }

                // Validate status
                const validStatuses = ['enrolled', 'completed', 'withdrawn'];
                if (!validStatuses.includes(status)) {
                    return res.status(400).send(`Invalid course status: ${status}`);
                }

                // Add or update course in valid courses array
                const courseIndex = updatedStudent.courses.findIndex(c => c.course.toString() === course);
                if (courseIndex >= 0) {
                    updatedStudent.courses[courseIndex] = {
                        course,
                        status,
                        completedDate,
                        grade
                    };
                } else {
                    validCourses.push({
                        course,
                        status,
                        completedDate,
                        grade
                    });
                }
            }
            updatedStudent.courses.push(...validCourses);
        }

        const savedStudent = await updatedStudent.save()

        return res.status(201).send(savedStudent)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

//delete a student

studentRouter.delete('/:studentId', async (req, res, next) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.studentId)
        return res.status(201).send(`You have deleted ${deletedStudent.name}`)
    } catch (error) {
        res.status(500)
        return next(error)
    }
})

module.exports = studentRouter