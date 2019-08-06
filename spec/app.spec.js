process.env.NODE_ENV = 'test';
const { expect } = require('chai');
//const chaiSorted = require('chai-sorted');
//chai.use(chaiSorted);
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
          .expect(200);
      });
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
    describe('/articles/:article_id', () => {
      it('GET status 200, responds with an article object', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).to.eql({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2018-11-15T12:21:54.171Z',
              votes: 100,
              comment_count: '13'
            });
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
      describe.only('/comments', () => {
        it('POST status 201, responds with the posted comment object', () => {
          return request(app)
            .post('/api/articles/3/comments')
            .send({
              article_id: 3,
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
      });
    });
  });
});
