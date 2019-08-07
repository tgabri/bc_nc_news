const { patchComment, deleteComment } = require('../models/comment-model');

exports.updateComment = (req, res, next) => {
  patchComment(req.params, req.body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  deleteComment(req.params)
    .then(comment => {
      res.sendStatus(204);
    })
    .catch(next);
};
