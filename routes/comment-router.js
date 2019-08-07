const commentRouter = require('express').Router();
const {
  updateComment,
  removeComment
} = require('../controllers/comment-controller');

commentRouter
  .route('/:comment_id')
  .patch(updateComment)
  .delete(removeComment);

module.exports = commentRouter;
