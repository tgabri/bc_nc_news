const articleRouter = require('express').Router();
const {
  getArticle,
  patchArticle,
  createComment,
  getComments,
  getArticles
} = require('../controllers/article-controller');
const { methodsNotAllowed } = require('../error/index');

articleRouter
  .route('/')
  .get(getArticles)
  .all(methodsNotAllowed);

articleRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

articleRouter
  .route('/:article_id/comments')
  .post(createComment)
  .get(getComments);

module.exports = articleRouter;
