const db = require("../db/connection");

const selectUsers = () => {
  let queryString = `SELECT * FROM users;`;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

const selectUsersByUserName = (username) => {
  if (!isNaN(username)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const queryStr = `
  SELECT * FROM users WHERE username = $1`;

  return db.query(queryStr, [username]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found In The Database" });
    }
    return rows[0];
  });
};

module.exports = { selectUsers, selectUsersByUserName };
