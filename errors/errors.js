exports.handlePathErr = (req, res) => {
  res.status(404).send({ msg: "Invalid path" });
};

exports.handleServerErrors = (err, req, res) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};