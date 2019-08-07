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
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .count('comments.article_id  as comment_count')
    .where('articles.article_id', '=', article_id)
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
      .then(article => {
        if (!article.length) {
          return Promise.reject({ msg: 'Page Not Found', status: 404 });
        } else return article;
      });
  }
};

exports.insertComment = comment => {
  return db
    .insert(comment)
    .into('comments')
    .returning('*');
};

exports.selectComments = ({ article_id }, { order = 'desc' }) => {
  return db
    .select('comment_id', 'votes', 'author', 'body', 'created_at')
    .from('comments')
    .where('article_id', '=', article_id)
    .orderBy('created_at', order)
    .then(comments => {
      if (!comments.length) {
        return Promise.reject({ msg: 'Page Not Found', status: 404 });
      } else return comments;
    });
};
exports.selectArticles = ({
  sorted_by = 'created_at',
  order = 'desc',
  author,
  topic
}) => {
  if (
    sorted_by === 'article_id' ||
    sorted_by === 'title' ||
    sorted_by === 'topic' ||
    sorted_by === 'author' ||
    sorted_by === 'created_at' ||
    sorted_by === 'votes'
  ) {
    return db
      .select(
        'articles.article_id',
        'title',
        'topic',
        'articles.author',
        'articles.created_at',
        'articles.votes'
      )
      .from('articles')
      .leftJoin('comments', 'articles.article_id', 'comments.article_id')
      .groupBy('articles.article_id')
      .count('comments.article_id as comment_count')
      .orderBy(sorted_by, order)
      .modify(existingQuery => {
        if (author) {
          existingQuery.where('articles.author', '=', author);
        }
        if (topic) {
          existingQuery.where('articles.topic', '=', topic);
        } else existingQuery;
      })
      .then(articles => {
        if (!articles.length) {
          return Promise.reject({ msg: 'Page Not Found', status: 404 });
        } else return articles;
      });
  } else {
  }
  return Promise.reject({ msg: 'Bad Request', status: 400 });
};
