process.env.NODE_ENV = 'test';
const { expect } = require('chai');
//const chaiSorted = require('chai-sorted');
//chai.use(chaiSorted);
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection/connection');

describe('app', () => {
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
  });
});
