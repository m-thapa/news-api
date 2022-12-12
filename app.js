const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./controllers/topics.controller");
const { handlePathErr, handleServerErrors } = require("./errors/errors.js");

//handle requests
app.use("/api/topics", getTopics);

app.all("*", handlePathErr);

app.use(handleServerErrors);

module.exports = app;
