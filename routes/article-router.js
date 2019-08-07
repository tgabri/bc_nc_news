const articleRouter = require('express').Router();
const {
  getArticle,
  patchArticle,
  createComment,
  getComments
} = require('../controllers/article-controller');

articleRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

articleRouter
  .route('/:article_id/comments')
  .post(createComment)
  .get(getComments);

module.exports = articleRouter;
