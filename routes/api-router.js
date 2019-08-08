const apiRouter = require('express').Router();
const topicRouter = require('./topic-router');
const userRouter = require('./user-router');
const articleRouter = require('./article-router');
const commentRouter = require('./comment-router');
const endpoints = require('../endpoints.json');

apiRouter.route('/').get((req, res) => res.status(200).send(endpoints));

apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;
