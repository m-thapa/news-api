const { selectUsers, selectUsersByUserName } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersByUserName = (req, res, next) => {
  const { username } = req.params;
  selectUsersByUserName(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => next(err));
};
