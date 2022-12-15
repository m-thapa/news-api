const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");

const {
  getArticles,
  getArticleById,
} = require("./controllers/articles.controller");

const { handlePathErr, handleServerErrors } = require("./errors/errors.js");

//handle requests
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

// handle path errors
app.all("*", handlePathErr);

// error handlers
app.use(handleServerErrors);

module.exports = app;
