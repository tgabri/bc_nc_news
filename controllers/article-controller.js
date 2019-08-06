const {
  selectArticle,
  updateArticle,
  insertComment
} = require('../models/article-model');

exports.getArticle = (req, res, next) => {
  selectArticle(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  updateArticle(req.params, req.body)
    .then(updatedArticle => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.createComment = (req, res, next) => {
  insertComment(req.params, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
