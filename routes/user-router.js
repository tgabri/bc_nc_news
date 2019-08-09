const userRouter = require('express').Router();
const {
  getUsers,
  getUserByUsername
} = require('../controllers/user-controller');
const { methodsNotAllowed } = require('../error/index');

userRouter
  .route('/')
  .get(getUsers)
  .all(methodsNotAllowed);
userRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(methodsNotAllowed);

module.exports = userRouter;
