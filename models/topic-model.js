const db = require('../db/connection/connection');

exports.selectTopics = () => {
  return db.select('*').from('topics');
};

exports.insertTopic = topic => {
  if (!topic.hasOwnProperty('slug', 'description')) {
    return Promise.reject({ msg: 'Bad Request', status: 400 });
  } else {
    return db
      .insert(topic)
      .into('topics')
      .returning('*');
  }
};
