const db = require('../db/connection/connection');

exports.fetchUsers = () => {
  return db.select('*').from('users');
};

exports.selectUser = ({ username }) => {
  return db
    .select('*')
    .from('users')
    .where('username', '=', username)
    .then(user => {
      if (!user.length) {
        return Promise.reject({ msg: 'Page Not Found', status: 404 });
      } else return user;
    });
};

exports.insertUser = user => {
  if (!user.hasOwnProperty('username')) {
    return Promise.reject({ msg: 'Bad Request', status: 400 });
  } else {
    return db
      .insert(user)
      .into('users')
      .returning('*');
  }
};
