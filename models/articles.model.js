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

const insertComment = async (newComment, article_id) => {
  const { username, body } = newComment;

  if (!username || !body)
    return Promise.reject({ status: 400, msg: "Bad Request" });

  if (article_id < 1)
    return Promise.reject({ status: 400, msg: "Bad Request" });

  const SQL = `
  SELECT * FROM articles
  WHERE article_id = $1;`;

  const { rowCount } = await db.query(SQL, [article_id]);
  if (rowCount === 0)
    return Promise.reject({
      status: 404,
      msg: `Article ${article_id} Is Not In The Database`,
    });

  const SQL2 = `
  SELECT * FROM users
  WHERE username = $1;`;

  const result = await db.query(SQL2, [username]);
  if (result.rowCount === 0)
    return Promise.reject({ status: 404, msg: "Username Not Found" });

  const queryString = `
  INSERT INTO comments
  (article_id, author, body)
  VALUES
  ($1, $2, $3)
  RETURNING *;
  `;

  return db
    .query(queryString, [article_id, username, body])
    .then(({ rows }) => rows[0]);
};

module.exports = {
  selectArticles,
  selectArticleById,
  selectArticleIdByComment,
  insertComment,
};
