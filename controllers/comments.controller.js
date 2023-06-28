const { dropComments } = require("../models/comments.model");

const deleteComments = (req, res, next) => {
  const { comment_id } = req.params;

  dropComments(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => next(err));
};

module.exports = { deleteComments };
