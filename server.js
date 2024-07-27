const express = require('express')
const morgan = require("morgan")
const mongoose = require("mongoose")
require('dotenv').config()
const URL = process.env.MONGO_URL
const path = require('path')
const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.use(express.static(path.join(__dirname, "client", "dist")));


const connectToDb = async () => {
    try {
        await mongoose.connect(URL)
        console.log("connected to DB")
    } catch (error) {
        console.log(error)
    }
}

connectToDb()

app.use("/students", require("./routes/studentRouter.js"))
app.use("/courses", require("./routes/courseRouter.js"))

app.use((err, req, res, next) => {
    console.log(err)
    return res.send({errMsg: err.message})
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(9000, () => console.log("the server is running on port 9000"))
