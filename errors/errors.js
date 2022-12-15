exports.handlePathErr = (req, res) => {
  res.status(404).send({ msg: "Invalid path" });
};

exports.handlePsqlErr = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handleCustomErr = (err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
