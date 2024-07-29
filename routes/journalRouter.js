const express = require('express')
const journalRouter = express.Router()
const Journal = require('../models/journal')


journalRouter.get("/", async(req, res, next) => {
  try {
    const entries = await Journal.find()
    return res.status(200).send(entries)
  }catch (error) {
    res.status(500)
    return next(error)
}

    })
    
    journalRouter.post("/", async(req, res, next) => {
      try{
        const newEntry = await new Journal(req.body)
        const savedEntry = await newEntry.save()
        return res.status(201).send(savedEntry)
      } catch (error) {
          res.status(500)
          return next(error)
      }

    })

    module.exports = journalRouter