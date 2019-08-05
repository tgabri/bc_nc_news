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
        created_at: new Date(154700514171)
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
        created_at: new Date(280844514171)
      },
      {
        title: 'Moustache',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Have you seen the size of that thing?',
        created_at: new Date(154700514171)
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
describe('makeRefObj', () => {
  it('if an empty array passed, it returns an empty array', () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it('if an array of single object passed, it returns an object with a key value pair made up of values from the original input', () => {
    const input = [
      {
        article_id: 1,
        title: 'Moustache',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Have you seen the size of that thing?',
        created_at: 154700514171
      }
    ];
    const title = 'title';
    const id = 'article_id';
    const actual = makeRefObj(input, title, id);
    const expected = { Moustache: 1 };
    expect(actual).to.eql(expected);
  });
  it('if an array of multiple objects passed, it returns an object with key value pairs made up of values from the original input', () => {
    const input = [
      {
        article_id: 1,
        title: 'Moustache',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Have you seen the size of that thing?',
        created_at: 154700514171
      },
      {
        article_id: 2,
        title: 'Am I a cat?',
        topic: 'mitch',
        author: 'icellusedkars',
        body:
          'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
        created_at: 280844514171
      }
    ];
    const title = 'title';
    const id = 'article_id';
    const actual = makeRefObj(input, title, id);
    const expected = { Moustache: 1, 'Am I a cat?': 2 };
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
    makeRefObj(input);
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

describe('formatComments', () => {
  it('returns an empty array when an empty array is passed as an input', () => {
    const input = [];
    const lookup = [];
    const actual = formatComments(input, lookup);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it('the original input is not mutated', () => {
    const input = [
      {
        body: "I am 100% sure that we're not completely sure.",
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1069850163389
      }
    ];
    const lookup = { 'UNCOVERED: catspiracy to bring down democracy': 1 };
    formatComments(input, lookup);
    expect(input).to.deep.equal([
      {
        body: "I am 100% sure that we're not completely sure.",
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1069850163389
      }
    ]);
  });
  it('if an array of a single object passed, it returns a new array with shop key changed to shop_id', () => {
    const input = [
      {
        body: "I am 100% sure that we're not completely sure.",
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1069850163389
      }
    ];
    const lookup = { 'UNCOVERED: catspiracy to bring down democracy': 1 };
    const actual = formatComments(input, lookup);
    const expected = [
      {
        body: "I am 100% sure that we're not completely sure.",
        article_id: 1,
        author: 'butter_bridge',
        votes: 1,
        created_at: new Date(1069850163389)
      }
    ];
    expect(actual).to.eql(expected);
  });
});
