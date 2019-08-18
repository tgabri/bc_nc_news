const { fetchUsers, selectUser, insertUser } = require('../models/user-model');

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};
exports.getUserByUsername = (req, res, next) => {
  selectUser(req.params)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(err => next(err));
};

exports.addUser = (req, res, next) => {
  insertUser(req.body)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
