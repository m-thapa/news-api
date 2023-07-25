const db = require("../db/connection");

const selectArticles = (topic, sort_by = "created_at", order = "desc") => {
  let validSortQuery = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validSortQuery.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const validOrderQuery = ["asc", "desc"];

  if (!validOrderQuery.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let topicValue = [];
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
  
  `;

  if (topic !== undefined) {
    queryStr += `
    WHERE articles.topic =$1`;
    topicValue.push(topic);
  }

  queryStr += `GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, topicValue).then(({ rows }) => rows);
};

const selectArticleById = (article_id) => {
  if (article_id < 1) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryStr = `
SELECT 
articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comments.body) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
WHERE articles.article_id =$1
GROUP BY articles.article_id
;`;

  return db.query(queryStr, [article_id]).then(({ rows, rowCount }) => {
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
      msg: "Bad request",
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
    return Promise.reject({ status: 400, msg: "Bad request" });

  if (article_id < 1)
    return Promise.reject({ status: 400, msg: "Bad request" });

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

const updateArticles = (article_id, incrementBy) => {
  if (incrementBy === undefined) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const queryString = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`;

  return db
    .query(queryString, [incrementBy, article_id])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found In The Database",
        });
      }
      return rows[0];
    });
};

const insertArticles = async (newArticle) => {
  const { author, title, body, topic } = newArticle;

  if (!author || !title || !body || !topic) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!isNaN(author) || !isNaN(topic) || !isNaN(body) || !isNaN(title)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const query1 = `
  SELECT * FROM articles
  WHERE author  = $1`;

  const result1 = await db.query(query1, [author]);
  if (result1.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found In The Database" });
  }

  const query2 = `
  SELECT * FROM articles
  WHERE topic = $1`;

  const result2 = await db.query(query2, [topic]);
  if (result2.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not Found In The Database" });
  }

  const SQL = `
  INSERT INTO articles
  (author, title, body, topic)
  VALUES
  ($1,$2,$3,$4)
  RETURNING *;`;
  return db
    .query(SQL, [author, title, body, topic])
    .then(() => {
      const queryStr = `
    SELECT articles.author, articles.title, articles.body, articles.topic, articles.article_id,
    articles.votes, articles.created_at, COUNT(comments.body) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = 13
    GROUP BY articles.article_id;
    `;
      return db.query(queryStr).then(({ rows }) => {
        return rows[0];
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  selectArticles,
  selectArticleById,
  selectArticleIdByComment,
  insertComment,
  updateArticles,
  insertArticles,
};
