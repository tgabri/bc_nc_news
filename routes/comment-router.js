const commentRouter = require('express').Router();
const { updateComment } = require('../controllers/comment-controller');

commentRouter.route('/:comment_id').patch(updateComment);

module.exports = commentRouter;
