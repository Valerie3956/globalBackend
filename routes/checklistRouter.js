const express = require('express')
const checklistRouter = express.Router()
const Checklist = require('../models/checklist')


checklistRouter.get("/", async (req, res, next) => {
  try {
const items = await Checklist.find()
return res.status(200).send(items)
  } catch (error) {
    res.status(500)
    return next(error)
  }

})

checklistRouter.post("/", async (req, res, next) => {
try {
  const newItem = await new Checklist(req.body)
const savedItem = await newItem.save()
return res.status(201).send(savedItem)
} catch (error) {
  res.status(500)
  return next(error)
}

})

checklistRouter.delete("/:checklistId", async (req, res, next) => {
try {
const deletedItem = await Checklist.findByIdAndDelete(req.params.checklistId)
return res.status(200).send(`Successfully deleted checklist item ${deletedItem.item} from the database`)
} catch (error) {
  res.status(500)
  return next(error)
}

})

checklistRouter.put('/:checklistId', async (req, res, next) => {

try{
  const updatedItem = await Checklist.findByIdAndUpdate(
    req.params.checklistId,
    req.body,
    {new:true},
  )
return res.status(201).send(updatedItem)
} catch (error) {
  res.status(500)
  return next(error)
}
})















module.exports = checklistRouter