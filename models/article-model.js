const db = require('../db/connection/connection');

exports.selectArticle = article_id => {
  return (
    db
      .select(
        'articles.article_id',
        'title',
        'topic',
        'articles.author as username',
        'articles.body',
        'articles.created_at',
        'articles.votes'
      )
      .from('articles')
      .leftJoin('comments', 'articles.article_id', 'comments.article_id')
      .groupBy('articles.article_id')
      .count('comments.article_id  as comment_count')
      .where('articles.article_id', '=', article_id)
      // .then(articles => {
      //   console.log(articles);
      //   articles.map(article => {
      //     const { author, ...restOfArticles } = article;
      //     return { ...restOfArticles, username: author };
      //   });
      // })
      .then(article => {
        // console.log(article, 'model');
        if (!article.length) {
          return Promise.reject({ msg: 'Page Not Found', status: 404 });
        } else return article;
      })
  );
};

exports.updateArticle = ({ article_id }, { inc_votes = 0 }) => {
  return db('articles')
    .where('article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(article => {
      if (!article.length) {
        return Promise.reject({ msg: 'Page Not Found', status: 404 });
      } else return article;
    });
};

exports.insertComment = comment => {
  if (!comment.hasOwnProperty('username', 'body')) {
    return Promise.reject({ msg: 'Bad Request', status: 400 });
  } else {
    return db
      .insert({ author: comment.username, body: comment.body })
      .into('comments')
      .returning('*');
  }
};

exports.insertArticle = article => {
  if (!article.hasOwnProperty('author', 'body', 'title', 'topic')) {
    return Promise.reject({ msg: 'Bad Request', status: 400 });
  } else {
    return db
      .insert(article)
      .into('articles')
      .returning('*');
  }
};

exports.deleteArticle = ({ article_id }) => {
  return db('articles')
    .where('article_id', '=', article_id)
    .del()
    .then(article => {
      if (article === 0)
        return Promise.reject({ msg: 'Page Not Found', status: 404 });
    });
};

exports.selectComments = (
  article_id,
  order = 'desc',
  sorted_by = 'created_at',
  limit = 10,
  p
) => {
  return db
    .select('comment_id', 'votes', 'author', 'body', 'created_at')
    .from('comments')
    .where('article_id', '=', article_id)
    .orderBy(sorted_by, order)
    .limit(limit)
    .offset(p * limit - limit);
};

exports.selectArticles = ({
  sorted_by = 'created_at',
  order = 'desc',
  author,
  topic,
  limit = 10,
  p,
  username
}) => {
  if (
    sorted_by === 'article_id' ||
    'title' ||
    'topic' ||
    'author' ||
    'created_at' ||
    'votes'
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
      .count('articles.article_id as total_count')
      .orderBy(sorted_by, order)
      .limit(limit)
      .offset(p * limit - limit)
      .modify(existingQuery => {
        if (author) {
          existingQuery.where('articles.author', '=', author);
        }
        if (username) {
          existingQuery.where('articles.author', '=', username);
        }
        if (topic) {
          existingQuery.where('articles.topic', '=', topic);
        } else existingQuery;
      })
      .then(articles =>
        articles.map(article => {
          const { author, ...restOfArticles } = article;
          return { ...restOfArticles, username: author };
        })
      )
      .then(articles => {
        if (!articles.length) {
          return Promise.reject({ msg: 'Page Not Found', status: 404 });
        } else return articles;
      });
  } else {
    return Promise.reject({ msg: 'Bad Request', status: 400 });
  }
};
