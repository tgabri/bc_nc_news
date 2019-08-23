const {
  selectArticle,
  updateArticle,
  insertComment,
  selectComments,
  selectArticles,
  insertArticle,
  deleteArticle
} = require('../models/article-model');

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then(([article]) => {
      res.status(200).send(article);
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
  const { article_id } = req.params;
  const article = selectArticle(article_id);
  const comments = insertComment({ ...req.params, ...req.body });
  Promise.all([article, comments])
    .then(([article, comment]) => {
      if (article[0]) {
        res.status(201).send({ comment });
      }
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { order, sorted_by, limit, p } = req.query;
  const regex = /\d+/gm;
  if (!regex.test(article_id)) {
    return next({
      status: 400,
      msg: 'Bad Request: Given ID is not an integer'
    });
  }
  const article = selectArticle(article_id);
  const comments = selectComments(article_id, order, sorted_by, limit, p);
  Promise.all([article, comments])
    .then(([article, comments]) => {
      if (article[0].comment_count === '0') {
        res.status(200).send({ comments: [] });
      } else {
        res.status(200).send({ comments });
      }
      return comments;
    })
    .catch(err => next(err));
};

exports.getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  insertArticle(req.body)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.removeArticle = (req, res, next) => {
  deleteArticle(req.params)
    .then(article => {
      res.sendStatus(204);
    })
    .catch(next);
};
