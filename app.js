const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router.js');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
  next({ status: 404, msg: 'Page Not Found' });
});
app.use((err, req, res, next) => {
  console.log(err);
  if (err.status) res.status(err.status).send({ msg: err.msg });
  if (err.code === '22P02') res.status(400).send({ msg: 'Bad Request' });
  if (err.code === '23503')
    res.status(404).send({ status: 404, msg: 'Page Not Found' });
  else res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
