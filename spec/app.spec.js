process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
chai.use(chaiSorted);
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection/connection');

describe('app', () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => connection.destroy());
  describe('/api', () => {
    it('Endpoint JSON', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
        });
    });
    it('INVALID METHODS - DELETE, PATCH, PUT, responds with 405', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Method Not Allowed');
          });
      });
      return Promise.all(methodPromises);
    });
    it('ERROR status 404 when wrong path given', () => {
      return request(app)
        .get('/api/tupic')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Page Not Found');
        });
    });
    describe('/topics', () => {
      it('GET status 200, responds with an array of objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an('Array');
            expect(body.topics[0]).to.be.an('Object');
          });
      });
      it('GET status 200, responds with an array of topics objects and each object has the right properties', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body.topics[0]).to.have.keys('slug', 'description');
          });
      });
      it('POST status 201, responds with the posted topic object', () => {
        return request(app)
          .post('/api/topics')
          .send({
            slug: 'witch',
            description: 'The man, the legend'
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.topic.slug).to.equal('witch');
            expect(body.topic.description).to.equal('The man, the legend');
          });
      });
      it('ERROR, POST status 400, responds with an error message when it  does not include all the required keys', () => {
        return request(app)
          .post('/api/topics')
          .send({
            description: 'Student SUES Mitch!'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request');
          });
      });
      it('INVALID METHODS - DELETE, PATCH, PUT, responds with 405', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method Not Allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe('/users', () => {
      it('GET status 200, responds with an array of objects', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            expect(body.users).to.be.an('Array');
            expect(body.users[0]).to.be.an('Object');
          });
      });
      it('GET status 200, responds with an array of topics objects and each object has the right properties', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            expect(body.users[0]).to.have.keys(
              'username',
              'avatar_url',
              'name'
            );
          });
      });
      it('INVALID METHODS - DELETE, PATCH, PUT, responds with 405', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/users')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method Not Allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
    it('POST status 201, responds with the posted user object', () => {
      return request(app)
        .post('/api/users')
        .send({
          username: 'mitch22',
          avatar_url:
            'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
          name: 'mitch'
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.user.username).to.equal('mitch22');
          expect(body.user.name).to.equal('mitch');
        });
    });
    it('ERROR, POST status 400, responds with an error message when it  does not include all the required keys', () => {
      return request(app)
        .post('/api/users')
        .send({
          name: 'Student SUES Mitch!'
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal('Bad Request');
        });
    });
    describe('/users/:username', () => {
      it('GET status 200, responds with a user object', () => {
        return request(app)
          .get('/api/users/icellusedkars')
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.eql({
              username: 'icellusedkars',
              name: 'sam',
              avatar_url:
                'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
            });
          });
      });
      it('GET status 200, responds with an array of topics objects and each object has the right properties', () => {
        return request(app)
          .get('/api/users/icellusedkars')
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.have.keys('username', 'avatar_url', 'name');
          });
      });
      it('ERROR, GET status 404, responds with an error message', () => {
        return request(app)
          .get('/api/users/icelluzedkars')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Page Not Found');
          });
      });
      it('INVALID METHODS - DELETE, PATCH, PUT, responds with 405', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/users/butter_bridge')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method Not Allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe('/articles', () => {
      it('GET status 200, responds with an array of objects', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('Array');
            expect(body.articles[0]).to.be.an('Object');
          });
      });
      it('GET status 200, responds with an array of topics objects and each object has the right properties', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.every(article => article.article_id)).to.be.true;
            expect(articles.every(article => article.title)).to.be.true;
            expect(articles.every(article => article.topic)).to.be.true;
            expect(articles.every(article => article.author)).to.be.true;
            expect(articles.every(article => article.created_at)).to.be.true;
            expect(articles.every(article => article.comment_count)).to.be.true;
            // expect(articles.every(article => article.votes)).to.be.true;
          });
      });
      it('GET status 200, it has a total_count property', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.every(article => article.total_count)).to.be.true;
          });
      });
      it('GET status 200, [DEFAULT] responds with an array of comments objects sorted by date', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('GET status 200, can change sorted by to any valid column', () => {
        return request(app)
          .get('/api/articles?sorted_by=article_id')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('article_id', {
              descending: true
            });
          });
      });
      it('GET status 200, [DEFAULT] responds with an array of comments objects in desc order', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('GET status 200, can change order to asc or desc', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('created_at', {
              ascending: true
            });
          });
      });
      it('GET status 200, can filter by the author value', () => {
        return request(app)
          .get('/api/articles?author=icellusedkars')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].author).to.be.equal('icellusedkars');
          });
      });
      it('GET status 200, can filter by the topic value', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].topic).to.be.equal('cats');
          });
      });
      it('GET status 200, [DEFAULT] responds with an array of article objects limited to 10', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(10);
          });
      });
      it('GET status 200, can change limit to any number', () => {
        return request(app)
          .get('/api/articles?limit=5')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(5);
          });
      });
      it('GET status 200, can pick a page to start from', () => {
        return request(app)
          .get('/api/articles?limit=5&p=3')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.have.lengthOf(2);
          });
      });
      it('POST status 201, responds with the posted comment object', () => {
        return request(app)
          .post('/api/articles')
          .send({
            author: 'icellusedkars',
            title: 'Student SUES Mitch!',
            body: 'Hello',
            topic: 'mitch'
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.article.title).to.equal('Student SUES Mitch!');
          });
      });
      it('ERROR, POST status 400, responds with an error message when it  does not include all the required keys', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'Student SUES Mitch!'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request');
          });
      });
      it('ERROR, GET status 404, responds with an error message when the id doesnt exist', () => {
        return request(app)
          .get('/api/articles/?topic=cat')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Page Not Found');
          });
      });
      it('ERROR, GET status 400, responds with an error message when invalid column passed', () => {
        return request(app)
          .get('/api/articles/?sorted_by=5')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request');
          });
      });
      it('INVALID METHODS - DELETE, PATCH, PUT, responds with 405', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method Not Allowed');
            });
        });
        return Promise.all(methodPromises);
      });
      describe('/articles/:article_id', () => {
        it('GET status 200, responds with an article object', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.be.an('Array');
            });
        });
        it('GET status 200, responds with an array of article objects and each object has the right properties', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.every(article => article.article_id)).to.be.true;
              expect(article.every(article => article.title)).to.be.true;
              expect(article.every(article => article.topic)).to.be.true;
              expect(article.every(article => article.author)).to.be.true;
              expect(article.every(article => article.created_at)).to.be.true;
              expect(article.every(article => article.comment_count)).to.be
                .true;
            });
        });
        it('ERROR, GET status 404, responds with an error message when the id doesnt exist', () => {
          return request(app)
            .get('/api/articles/15')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Page Not Found');
            });
        });
        it('ERROR, GET status 400, responds with an error message when wrong path called', () => {
          return request(app)
            .get('/api/articles/one')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Bad Request');
            });
        });
        it('PATCH status 200, responds with an object with a value changed/updated', () => {
          return request(app)
            .patch('/api/articles/2')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).to.equal(1);
            });
        });
        it('INVALID METHOD - POST, responds with 405', () => {
          return request(app)
            .post('/api/articles/1')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Method Not Allowed');
            });
        });
        it('ERROR, PATCH status 400, responds with an error message when wrong path called', () => {
          return request(app)
            .patch('/api/articles/one')
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Bad Request');
            });
        });
        it('ERROR, PATCH status 404, responds with an error message when the id doesnt exist', () => {
          return request(app)
            .patch('/api/articles/25')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Page Not Found');
            });
        });
        it('ERROR, PATCH status 400, if the patching value is not valid, it responds with the original value, untouched', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'm' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Bad Request');
            });
        });
        it('ERROR, PATCH status 200, if invalid key passed, it responds with the original value, untouched', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ invalid: 1 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).to.equal(100);
            });
        });
        it('DELETE status 204, responds with 204 if success', () => {
          return request(app)
            .delete('/api/articles/1')
            .expect(204);
        });
        it('ERROR, DELETE status 400, responds with an error message when wrong id passed', () => {
          return request(app)
            .delete('/api/articles/one')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Bad Request');
            });
        });
        it('ERROR, DELETE status 404, responds with an error message when id does not exist', () => {
          return request(app)
            .delete('/api/articles/55')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Page Not Found');
            });
        });
        describe('/comments', () => {
          it('POST status 201, responds with the posted comment object', () => {
            return request(app)
              .post('/api/articles/3/comments')
              .send({
                username: 'icellusedkars',
                body: 'I need a new pair of glasses'
              })
              .expect(201)
              .then(({ body }) => {
                expect(body.comment[0].body).to.equal(
                  'I need a new pair of glasses'
                );
              });
          });
          it('POST status 201, responds with the posted comment object', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'icellusedkars',
                body: 'I need a new pair of glasses'
              })
              .expect(201)
              .then(({ body }) => {
                expect(body.comment[0]).to.has.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body'
                );
              });
          });
          it('INVALID METHODS - DELETE, PATCH, PUT, responds with 405', () => {
            const invalidMethods = ['patch', 'put', 'delete'];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]('/api/articles/2/comments')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Method Not Allowed');
                });
            });
            return Promise.all(methodPromises);
          });
          it('ERROR, POST status 400, responds with an error message when it  does not include all the required keys', () => {
            return request(app)
              .post('/api/articles/one/comments')
              .send({
                body: 'I need a new pair of glasses'
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('Bad Request');
              });
          });
          it('ERROR, POST status 400, responds with an error message when wrong id passed', () => {
            return request(app)
              .post('/api/articles/one/comments')
              .send({
                author: 'icellusedkars',
                body: 'I need a new pair of glasses'
              })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('Bad Request');
              });
          });
          it('ERROR, POST status 404, responds with an error message when the id doesnt exist', () => {
            return request(app)
              .post('/api/articles/30/comments')
              .send({
                username: 'icellusedkars',
                body: 'I need a new pair of glasses'
              })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal('Page Not Found');
              });
          });
          it('GET status 200, can change limit to any number', () => {
            return request(app)
              .get('/api/articles/1/comments?limit=10')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.have.lengthOf(10);
              });
          });
          it('GET status 200, can pick a page to start from', () => {
            return request(app)
              .get('/api/articles/1/comments?limit=10&p=2')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.have.lengthOf(3);
              });
          });
          it('GET status 200, responds with an array of objects', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.an('Array');
                expect(body.comments[0]).to.be.an('Object');
              });
          });
          it('GET status 200, responds with an array of comments objects and each object has the right properties', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0]).to.have.keys(
                  'comment_id',
                  'votes',
                  'author',
                  'body',
                  'created_at'
                );
              });
          });
          it('GET status 200, serve an empty array when the article exists but has no comments', () => {
            return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.eql([]);
              });
          });
          it('GET status 200, [DEFAULT] responds with an array of comments objects sorted by created_at in descending order', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy('created_at', {
                  descending: true
                });
              });
          });
          it('GET status 200, can set the order to asc or desc, (default=>desc)', () => {
            return request(app)
              .get('/api/articles/1/comments?order=asc')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy('created_at', {
                  ascending: true
                });
              });
          });
          it('GET status 200, accept a "sort_by" query of any valid column', () => {
            return request(app)
              .get('/api/articles/1/comments?sorted_by=votes')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy('votes', {
                  descending: true
                });
              });
          });
          it('ERROR, GET status 400, responds with an error message when wrong path called', () => {
            return request(app)
              .get('/api/articles/one/comments')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal(
                  'Bad Request: Given ID is not an integer'
                );
              });
          });
          it('ERROR, GET status 404, responds with an error message when article does not exist', () => {
            return request(app)
              .get('/api/articles/25/comments')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal('Page Not Found');
              });
          });
        });
      });
    });
    describe('/comments', () => {
      it('PATCH status 200, responds with an object with a value changed/updated', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(17);
          });
      });
      it('INVALID METHOD - POST, responds with 405', () => {
        return request(app)
          .post('/api/comments/1')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Method Not Allowed');
          });
      });
      it('ERROR, PATCH status 400, responds with an error message when wrong id passed', () => {
        return request(app)
          .patch('/api/comments/one')
          .send({
            inc_votes: 1
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request');
          });
      });
      it('ERROR, PATCH status 400, if the value passed is not valid, it responds with an error message', () => {
        return request(app)
          .patch('/api/comments/2')
          .send({ inc_votes: 'm' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request');
          });
      });
      it('ERROR, PATCH status 200, if invalid or missing key passed, it responds with the original value, untouched', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ invalid: 1 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(16);
          });
      });
      it('ERROR, PATCH status 404, responds with an error message when the id doesnt exist', () => {
        return request(app)
          .patch('/api/comments/30')
          .send({
            inc_votes: 1
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Page Not Found');
          });
      });
      it('DELETE status 204, responds with 204 if success', () => {
        return request(app)
          .delete('/api/comments/3')
          .expect(204);
      });
      it('ERROR, DELETE status 400, responds with an error message when wrong id passed', () => {
        return request(app)
          .delete('/api/comments/one')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request');
          });
      });
      it('ERROR, DELETE status 404, responds with an error message when id does not exist', () => {
        return request(app)
          .delete('/api/comments/55')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Page Not Found');
          });
      });
    });
  });
});
