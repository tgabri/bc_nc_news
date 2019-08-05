const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData);
      const usersInsertions = knex('users').insert(userData);
      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {
          const formattedArticle = formatDates(articleData);
          return knex
            .insert(formattedArticle)
            .into('articles')
            .returning('*');
        })
        .then(articleRows => {
          const articleRef = makeRefObj(articleRows, 'title', 'article_id');
          const formattedComments = formatComments(commentData, articleRef);
          return knex('comments').insert(formattedComments);
        });
    });
};
