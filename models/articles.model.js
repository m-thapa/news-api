const db = require("../db/connection");

const selectArticles = () => {
  let queryStr = `
  SELECT 
  articles.author, articles.title, articles.article_id, 
  articles.topic,
  articles.created_at, articles.votes, 
  COUNT(comments.body) AS comment_count 
  FROM articles
  LEFT JOIN comments 
  ON 
  articles.article_id = comments.article_id
  GROUP BY
  articles.article_id 
  ORDER BY 
  created_at DESC
  ;
  `;
  return db.query(queryStr).then(({ rows }) => rows);
};

const selectArticleById = (article_id) => {
  if (article_id < 1) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryStr = `
SELECT 
article_id, author, title, body, topic, created_at, votes
FROM articles
WHERE article_id =$1;`;

  return db
    .query(queryStr, [article_id])

    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Does not exist in database",
        });
      }
      return rows[0];
    });
};

const selectArticleIdByComment = (article_id) => {
  if (parseInt(article_id) < 1) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments where article_id = $1 ORDER BY created_at DESC; `,
      [article_id]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return db
          .query(`SELECT article_id FROM articles WHERE article_id = $1`, [
            article_id,
          ])
          .then(({ rowCount }) => {
            if (rowCount === 0) {
              return Promise.reject({
                status: 404,
                msg: `article ${article_id} does not exist`,
              });
            }
            return [];
          });
      }
      return rows;
    });
};

module.exports = {
  selectArticles,
  selectArticleById,
  selectArticleIdByComment,
};
