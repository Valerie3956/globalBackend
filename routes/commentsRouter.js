const express = require("express")
const commentsRouter = express.Router()
const Comment = require("../models/comments")

//get all comments

commentsRouter.get("/", async (req, res, next) => {
  try {
    const comments = await Comment.find();
    return res.status(200).send(comments);
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

// get comments by run

commentsRouter.get("/run/:runId", async (req, res, next) => {
  try {
    const comments = await Comment.find({ run: req.params.runId });
    return res.status(200).send(comments);
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

// get comments by user

commentsRouter.get("/user/:userId", async (req, res, next) => {
  try {
    const comments = await Comment.find({ user: req.params.userId });
    return res.status(200).send(comments);
  } catch (err) {
    res.status(500);
    return next(err);
  }
});



//add new comment

commentsRouter.post("/:runId", async (req, res, next) => {
  try {
    req.body.user = req.auth._id;
    req.body.run = req.params.runId;
    req.body.userName = req.auth.username
    
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    
    return res.status(201).send(savedComment);
  } catch (err) {
    res.status(500);
    return next(err);
  }
});


//delete comment

  commentsRouter.delete("/:commentId", async (req, res, next) => {
    try {
      const deletedComment = await Comment.findOneAndDelete({
        _id: req.params.commentId,
        user: req.auth._id
      });
  
      if (!deletedComment) {
        res.status(403);
        return next(new Error("You may not delete someone else's comment"));
      }
  
      return res.status(200).send("Successfully deleted comment");
    } catch (err) {
      res.status(500);
      return next(err);
    }
  });
  

  //delete all comments for an run


  commentsRouter.delete("/run/:runId", async (req, res, next) => {
    try {
      await Comment.deleteMany({ run: req.params.runId });
      return res.status(200).send("Successfully deleted all comments for the run");
    } catch (err) {
      res.status(500);
      return next(err);
    }
  });
  

//modify comment



commentsRouter.put("/:commentId", async (req, res, next) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, user: req.auth._id },
      req.body,
      { new: true }
    );

    if (!updatedComment) {
      res.status(403);
      return next(new Error("You may not modify someone else's comment"));
    }

    return res.status(201).send(updatedComment);
  } catch (err) {
    res.status(500);
    return next(err);
  }
});


module.exports = commentsRouter