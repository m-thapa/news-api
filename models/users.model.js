const db = require("../db/connection");

const selectUsers = () => {
  let queryString = `SELECT * FROM users;`;
  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

module.exports = { selectUsers };
