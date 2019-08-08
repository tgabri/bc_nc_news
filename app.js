const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router.js');
const {
  handlePSQLErrors,
  handleCustomErrors,
  handle500
} = require('./error/index');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  next({ status: 404, msg: 'Page Not Found' });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = app;
