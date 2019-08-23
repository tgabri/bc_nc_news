const articleRouter = require('express').Router();
const {
  getArticle,
  patchArticle,
  createComment,
  getComments,
  getArticles,
  addArticle,
  removeArticle
} = require('../controllers/article-controller');
const { methodsNotAllowed } = require('../error/index');

articleRouter
  .route('/')
  .get(getArticles)
  .post(addArticle)
  .all(methodsNotAllowed);

articleRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .delete(removeArticle)
  .all(methodsNotAllowed);

articleRouter
  .route('/:article_id/comments')
  .post(createComment)
  .get(getComments)
  .all(methodsNotAllowed);

module.exports = articleRouter;
