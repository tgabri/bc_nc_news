const topicRouter = require('express').Router();
const { getTopics } = require('../controllers/topic-controller');
const { methodsNotAllowed } = require('../error/index');

topicRouter
  .route('/')
  .get(getTopics)
  .all(methodsNotAllowed);

module.exports = topicRouter;
