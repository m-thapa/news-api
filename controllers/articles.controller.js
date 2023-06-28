const {
  selectArticles,
  selectArticleById,
  selectArticleIdByComment,
  insertComment,
  updateArticles,
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  selectArticles(topic, sort_by, order)
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

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;

  insertComment(req.body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticles(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.postArticles = (req, res, next) => {
  insertArticles(req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => next(err));
};
