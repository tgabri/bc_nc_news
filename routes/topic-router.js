const topicRouter = require('express').Router();
const { getTopics, addTopic } = require('../controllers/topic-controller');
const { methodsNotAllowed } = require('../error/index');

topicRouter
  .route('/')
  .get(getTopics)
  .post(addTopic)
  .all(methodsNotAllowed);

module.exports = topicRouter;
