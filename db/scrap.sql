\c nc_news_test

 SELECT * FROM articles WHERE article_id = $1 ,
      [article_id]