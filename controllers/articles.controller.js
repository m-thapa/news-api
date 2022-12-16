const {
  selectArticles,
  selectArticleById,
  selectArticleIdByComment,
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch((err) => next(err));
};

exports.getArticleIdByComment = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleIdByComment(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
  
      next(err);
    });
};
