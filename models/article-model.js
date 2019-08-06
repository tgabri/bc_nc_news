const db = require('../db/connection/connection');

exports.selectArticle = ({ article_id }) => {
  return db
    .select(
      'articles.article_id',
      'title',
      'topic',
      'articles.author',
      'articles.body',
      'articles.created_at',
      'articles.votes'
    )
    .from('articles')
    .innerJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comments.article_id  as comment_count')
    .where('articles.article_id', '=', article_id)
    .returning('*')
    .then(article => {
      if (!article.length) {
        return Promise.reject({ msg: 'Page Not Found', status: 404 });
      } else return article;
    });
};

exports.updateArticle = ({ article_id }, { inc_votes }) => {
  if (typeof inc_votes !== 'number') {
    return db
      .select('*')
      .from('articles')
      .where('article_id', article_id)
      .returning('*')
      .then(article => {
        if (!article.length) {
          return Promise.reject({ msg: 'Page Not Found', status: 404 });
        } else return article;
      });
  } else {
    return db
      .select('*')
      .from('articles')
      .where('article_id', article_id)
      .increment('votes', inc_votes)
      .returning('*')
      .then(article => {
        if (!article.length) {
          return Promise.reject({ msg: 'Page Not Found', status: 404 });
        } else return article;
      });
  }
};

exports.insertComment = ({ article_id }, commentData) => {
  return db('comments')
    .insert(commentData)
    .where('article_id', '=', article_id)
    .returning('*');
};
