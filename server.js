const express = require('express')
const morgan = require("morgan")
const mongoose = require("mongoose")
require('dotenv').config()
const URL = process.env.MONGO_URL
const app = express()
const cors = require('cors');
const corsOptions = {
    origin: '*' ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  const {expressjwt} = require('express-jwt')
  const SECRET = process.env.SECRET



app.use(morgan('dev'))
app.use(express.json())
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
app.use('/leaderboard', require("./routes/leaderboardRouter.js"))

app.use("/auth", require('./routes/authRouter'))
app.use('/api', expressjwt({secret: SECRET, algorithms:["HS256"]}))
app.use('/api/game', require('./routes/gameRouter'))

app.use((err, req, res, next) => {
    console.log(err)
    return res.send({errMsg: err.message})
})


app.listen(9000, () => console.log("the server is running on port 9000"))
