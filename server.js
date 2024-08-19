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
  const YAHTZEE_SECRET = process.env.YAHTZEE_SECRET
const RUNNING_SECRET = process.env.RUNNING_SECRET


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

// student tracker app
app.use("/students", require("./routes/studentRouter.js"))
app.use("/courses", require("./routes/courseRouter.js"))

//yahtzee app
app.use('/leaderboard', require("./routes/leaderboardRouter.js"))

//morning routine app
app.use("/morning/journal", require("./routes/journalRouter.js"))
app.use("/morning/checklist", require("./routes/checklistRouter.js"))

//yahtzee protected routes
app.use("/auth", require('./routes/yahtzeeAuthRouter.js'))
app.use('/api', expressjwt({secret: YAHTZEE_SECRET, algorithms:["HS256"]}))
app.use('/api/game', require('./routes/gameRouter'))

//running protected routes
app.use("/run/auth", require('./routes/runningauthRouter'))
app.use('/run/api', expressjwt({secret: RUNNING_SECRET, algorithms:["HS256"]}))
app.use('/run/api/run', require('./routes/runRouter'))
app.use('/run/api/comments', require('./routes/commentsRouter'))

app.use((err, req, res, next) => {
    console.log(err)
    return res.send({errMsg: err.message})
})


app.listen(9000, () => console.log("the server is running on port 9000"))
