exports.formatDates = list => {
  if (!list.length) return [];
  let dateFormatObj = list.map(obj => {
    const { ...restOfObj } = obj;
    return { ...restOfObj, created_at: new Date(obj.created_at) };
  });
  return dateFormatObj;
};

exports.makeRefObj = (list, title, id) => {
  if (!list.length) return {};
  let refObj = {};
  list.forEach(article => {
    refObj[article[title]] = article[id];
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const { created_by, belongs_to, created_at, ...restOfObj } = comment;
    return {
      ...restOfObj,
      author: created_by,
      article_id: articleRef[belongs_to],
      created_at: new Date(created_at)
    };
  });
};
