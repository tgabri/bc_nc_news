const db = require('../db/connection/connection');

exports.patchComment = ({ comment_id }, { inc_votes }) => {
  if (typeof inc_votes !== 'number') {
    return db
      .select('*')
      .from('comments')
      .where('comment_id', comment_id);
  } else {
    return db('comments')
      .where('comment_id', comment_id)
      .increment('votes', inc_votes)
      .returning('*')
      .then(comment => {
        if (!comment.length) {
          return Promise.reject({ status: 404, msg: 'Page Not Found' });
        } else return comment;
      });
  }
};

exports.deleteComment = ({ comment_id }) => {
  return db('comments')
    .where('comment_id', '=', comment_id)
    .del();
};
