const commentRouter = require('express').Router();
const {
  updateComment,
  removeComment
} = require('../controllers/comment-controller');
const { methodsNotAllowed } = require('../error/index');

commentRouter
  .route('/:comment_id')
  .patch(updateComment)
  .delete(removeComment)
  .all(methodsNotAllowed);

module.exports = commentRouter;
