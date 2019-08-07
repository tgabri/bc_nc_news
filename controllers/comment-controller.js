const { patchComment } = require('../models/comment-model');

exports.updateComment = (req, res, next) => {
  patchComment(req.params, req.body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
