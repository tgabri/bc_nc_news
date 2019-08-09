const db = require('../db/connection/connection');

exports.patchComment = ({ comment_id }, { inc_votes = 0 }) => {
  return db('comments')
    .where('comment_id', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: 'Page Not Found' });
      } else return comment;
    });
};

exports.deleteComment = ({ comment_id }) => {
  return db('comments')
    .where('comment_id', '=', comment_id)
    .del()
    .then(comment => {
      if (comment === 0)
        return Promise.reject({ msg: 'Page Not Found', status: 404 });
    });
};
