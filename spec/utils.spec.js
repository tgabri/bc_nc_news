const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('if an empty array passed, it returns an empty array', () => {
    const input = [];
    const actual = formatDates(input);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it('if an array of a single object passed, it returns an array of object with a new created_at value', () => {
    const input = [
      {
        title: 'Moustache',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Have you seen the size of that thing?',
        created_at: 154700514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: 'Moustache',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Have you seen the size of that thing?',
        created_at: Date(154700514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it('if an array of multiple objects passed, it returns an array of objects with a new created_at value', () => {
    const input = [
      {
        title: 'Am I a cat?',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
        created_at: 280844514171
      },
      {
        title: 'Moustache',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Have you seen the size of that thing?',
        created_at: 154700514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: 'Am I a cat?',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
        created_at: Date(280844514171)
      },
      {
        title: 'Moustache',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Have you seen the size of that thing?',
        created_at: Date(154700514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it('the original input is not mutated', () => {
    const input = [
      {
        title: 'Am I a cat?',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
        created_at: 280844514171
      }
    ];
    formatDates(input);
    expect(input).to.deep.equal([
      {
        title: 'Am I a cat?',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
        created_at: 280844514171
      }
    ]);
  });
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
