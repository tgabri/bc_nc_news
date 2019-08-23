const userRouter = require('express').Router();
const {
  getUsers,
  getUserByUsername,
  addUser
} = require('../controllers/user-controller');
const { methodsNotAllowed } = require('../error/index');

userRouter
  .route('/')
  .get(getUsers)
  .post(addUser)
  .all(methodsNotAllowed);
userRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(methodsNotAllowed);

module.exports = userRouter;
