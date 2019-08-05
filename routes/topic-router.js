const topicRouter = require('express').Router();
const { getTopics } = require('../controllers/topic-controller');

topicRouter.use('/', getTopics);

module.exports = topicRouter;
