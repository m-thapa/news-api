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

module.exports = { selectArticles };
