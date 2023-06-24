const db = require("../db/connection");

const dropComments = (comment_id) => {
  if (comment_id < 1)
    return Promise.reject({ status: 400, msg: "Bad request" });

  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `${comment_id} Not Found In The Database`,
        });
      }

      const queryStr = `DELETE FROM comments WHERE comment_id=$1`;
      return db.query(queryStr, [comment_id]);
    });
};

module.exports = { dropComments };
