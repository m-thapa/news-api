const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Error 404: path not found", () => {
  it("status 404: invalid path ", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
});

describe("GET /api/topics", () => {
  it("should respond with status 200: and return an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  it("should respond with status 200 and return an articles array with author, title, article_id, topic, create_at, votes, comment_count and article_id", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });

  it("should respond with status 200 and return sorted articles by date in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("should respond with status 200 and return an article object, with article_id, author, title,  body, topic, created_at and votes", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: article_id,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 100,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("should respond with status 200 and return an article object including comment count", () => {
    const ARTICLE_ID = 1;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });

  it("should respond with status 200 and return comments sorted by most recent comments first", () => {
    const ARTICLE_ID = 1;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("should respond with status 200 and return an empty array when given an article that exists but has no comments", () => {
    const ARTICLE_ID = 12;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  it("should respond with status 404 and return article id is in valid format but does not exist", () => {
    const ARTICLE_ID = 9000;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article 9000 does not exist");
      });
  });
  it("should respond with status 400 and return an error message when article_id is an incorrect data type (string)", () => {
    const ARTICLE_ID = "one";
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  it("should respond with status 400 and return error message when article_id is an incorrect data type (negative int)", () => {
    const ARTICLE_ID = -1;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id", () => {
  it("should respond with status 201 and return an object in the form { inc_votes: newVote } with the updated article", () => {
    const article_id = 2;
    const newComment = {
      username: "butter_bridge",
      body: "Loren ipsum",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toBeInstanceOf(Object);
        expect.objectContaining({
          comment_id: 19,
          author: "butter_bridge",
          body: "Loren ipsum",
          article_id: `${article_id}`,
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  it("should respond with 400: missing a 'body' key from the client's request", () => {
    const article_id = 2;
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should respond with 404: non-existent article in the database", () => {
    const article_id = 999;
    const newComment = {
      username: "butter_bridge",
      body: "Loren ipsum",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Article ${article_id} Is Not In The Database`);
      });
  });
  it("should respond with 404: username requested by the client is not in the database", () => {
    const article_id = 2;
    const newComment = {
      username: "peter_griffin",
      body: "Loren ipsum",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Username Not Found");
      });
  });
  it("should respond with 400: invalid data type requested by the client (string)", () => {
    const article_id = "banana";
    const newComment = {
      username: "butter_bridge",
      body: "Loren Ipsum",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should respond with 400: invalid data type requested by the client (negative integer)", () => {
    const article_id = -12;
    const newComment = {
      username: "butter_bridge",
      body: "Loren Ipsum",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe('PATCH /api/articles/:article_id"', () => {
  it("should return status 200: and return the updated article", () => {
    const article_id = 1;
    const newVote = 67;
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toBeInstanceOf(Object);
        expect.objectContaining({
          article_id: `${article_id}`,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 167,
        });
      });
  });
  it("should respond with status 200: and decrement votes by the given amount for a certain article requested by the client", () => {
    const article_id = 1;
    const newVote = -67;
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toBeInstanceOf(Object);
        expect.objectContaining({
          article_id: `${article_id}`,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 33,
        });
      });
  });
  it("should respond with status 404: and return article does not exist in database", () => {
    const article_id = 999;
    const newVote = 28;
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found In The Database");
      });
  });
  it("should respond with status 400: and return inc_votes requested by the client is a string", () => {
    const article_id = 2;
    const newVote = "banana";
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should respond with status 400: and return inc_votes requested is a float", () => {
    const article_id = 2;
    const newVote = 89.5;
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should respond with status 400: and return invalid article_id requested by the client(string)", () => {
    const article_id = "banana";
    const newVote = 28;
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should respond with status 400: and return invalid article_id requested by the client(float)", () => {
    const article_id = 3.5;
    const newVote = 28;
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should respond with status 400: and return missing inc_votes key in the object requested by the client", () => {
    const article_id = 2;
    const inc = { noVoteRequested: 45 };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("should respond with status 400: and return missing body in the object requested by the client", () => {
    const article_id = 2;
    const newVote = {};
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET/api/users", () => {
  it("should respond with status: 200 and return an array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
