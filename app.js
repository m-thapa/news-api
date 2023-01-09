const express = require("express");
const cors = require("cors");
app.use(cors());

const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/topics.controller");

const {
  getArticles,
  getArticleById,
  getArticleIdByComment,
  postComment,
} = require("./controllers/articles.controller");

const {
  handlePathErr,
  handleServerErrors,
  handlePsqlErr,
  handleCustomErr,
} = require("./errors/errors.js");

//handle requests
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleIdByComment);

app.post("/api/articles/:article_id/comments", postComment);

// handle path errors
app.all("*", handlePathErr);

// error handlers
app.use(handleServerErrors);
app.use(handlePsqlErr);
app.use(handleCustomErr);

module.exports = app;
