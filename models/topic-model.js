const db = require('../db/connection/connection');

exports.fetchTopics = () => {
  return db.select('*').from('topics');
};
