const db = require('../db/connection/connection');

exports.fetchUsers = () => {
  return db.select('*').from('users');
};
