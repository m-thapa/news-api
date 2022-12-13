const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");

const { getArticles } = require("./controllers/articles.controller");

const { handlePathErr, handleServerErrors } = require("./errors/errors.js");

//handle requests
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.all("*", handlePathErr);

app.use(handleServerErrors);

module.exports = app;
