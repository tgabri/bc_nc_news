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
    });
    describe('/users/:username', () => {
      it('GET status 200, responds with a user object', () => {
        return request(app)
          .get('/api/users/icellusedkars')
          .expect(200)
          .then(({ body }) => {
            expect(body.user[0]).to.eql({
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
          .then(({ body }) => {
            expect(body.user[0]).to.have.keys('username', 'avatar_url', 'name');
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
          .then(({ body }) => {
            expect(body.articles[0]).to.have.keys(
              'article_id',
              'title',
              'topic',
              'author',
              'created_at',
              'votes',
              'comment_count'
            );
          });
      });
      it('GET status 200, [DEFAULT] responds with an array of comments objects sorted by date', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('GET status 200, can change sorted by to any valid column', () => {
        return request(app)
          .get('/api/articles?sorted_by=topic')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('topic', {
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
      it('GET status 200, can filter by the username value', () => {
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
      describe('/articles/:article_id', () => {
        it('GET status 200, responds with an array of object', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.be.an('Array');
              expect(body.article[0]).to.be.an('Object');
            });
        });
        it('GET status 200, responds with an array of topics objects and each object has the right properties', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              expect(body.article[0]).to.have.keys(
                'article_id',
                'title',
                'topic',
                'author',
                'body',
                'created_at',
                'votes',
                'comment_count'
              );
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
            .then(({ body }) => {
              expect(body.updatedArticle[0].votes).to.equal(1);
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
        it('ERROR, PATCH status 200, if the patchin value is not valid, it responds with the original value, untouched', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'm' })
            .expect(200)
            .then(({ body }) => {
              expect(body.updatedArticle[0].votes).to.equal(100);
            });
        });
        describe('/comments', () => {
          it('POST status 201, responds with the posted comment object', () => {
            return request(app)
              .post('/api/articles/3/comments')
              .send({
                author: 'icellusedkars',
                body: 'I need a new pair of glasses'
              })
              .expect(201)
              .then(({ body }) => {
                expect(body.comment[0].body).to.equal(
                  'I need a new pair of glasses'
                );
              });
          });
          it('ERROR, PATCH status 400, responds with an error message when wrong id passed', () => {
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
          it('ERROR, PATCH status 404, responds with an error message when the id doesnt exist', () => {
            return request(app)
              .post('/api/articles/20/comments')
              .send({
                author: 'icellusedkars',
                body: 'I need a new pair of glasses'
              })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal('Page Not Found');
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
          it('GET status 200, responds with a comments object', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.an('Array');
                expect(body.comments[0]).to.be.an('Object');
              });
            topics;
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
          it('ERROR, GET status 404, responds with an error message when the id doesnt exist', () => {
            return request(app)
              .get('/api/articles/25/comments')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal('Page Not Found');
              });
          });
          it('ERROR, GET status 400, responds with an error message when wrong path called', () => {
            return request(app)
              .get('/api/articles/one/comments')
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('Bad Request');
              });
          });
        });
      });
      describe.only('/comments', () => {
        it('PATCH status 200, responds with an object with a value changed/updated', () => {
          return request(app)
            .patch('/api/comments/2')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0].votes).to.equal(15);
              expect(body.comment[0]).to.eql({
                comment_id: 2,
                author: 'butter_bridge',
                article_id: 1,
                votes: 15,
                created_at: '2016-11-22T12:36:03.389Z',
                body:
                  'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
              });
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
      });
    });
  });
});
