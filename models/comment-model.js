const db = require('../db/connection/connection');

exports.patchComment = ({ comment_id }, { inc_votes }) => {
  return db
    .select('*')
    .from('comments')
    .where('comment_id', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: 'Page Not Found' });
      } else return comment;
    });
};
