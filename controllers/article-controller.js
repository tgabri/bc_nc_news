const {
  selectArticle,
  updateArticle,
  insertComment,
  selectComments,
  selectArticles
} = require('../models/article-model');

exports.getArticle = (req, res, next) => {
  selectArticle(req.params)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  updateArticle(req.params, req.body)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.createComment = (req, res, next) => {
  insertComment({ ...req.params, ...req.body })
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const regex = /\d+/gm;
  if (!regex.test(article_id)) {
    return next({
      status: 400,
      msg: 'Bad Request: Given ID is not an integer'
    });
  }
  selectComments(req.params, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
