exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err);
  if (err.code === '22P02' || err.code === '42703')
    res.status(400).send({ msg: 'Bad Request' });
  else if (err.code === '23503') {
    if (err.constraint === 'comments_article_id_foreign') {
      res.status(422).send({ msg: 'ID Not Found' });
    } else {
      res.status(400).send({ msg: 'Bad Request' });
    }
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
