const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const { getTopics } = require("./controllers/topics.controller");

const {
  getArticles,
  getArticleById,
  getArticleIdByComment,
  postComment,
  patchArticlesById,
} = require("./controllers/articles.controller");

const {
  handlePathErr,
  handleServerErrors,
  handlePsqlErr,
  handleCustomErr,
} = require("./errors/errors.js");

const { getUsers } = require("./controllers/users.controller");

const { deleteComments } = require("./controllers/comments.controller");

const endpoints = require("./endpoints.json");

//handle requests

app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleIdByComment);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticlesById);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComments);

// handle path errors
app.all("*", handlePathErr);

// error handlers
app.use(handleServerErrors);
app.use(handlePsqlErr);
app.use(handleCustomErr);

module.exports = app;
