exports.formatDates = list => {
  if (!list.length) return [];
  let dateFormatObj = list.map(obj => {
    const { ...restOfObj } = obj;
    return { ...restOfObj, created_at: Date(obj.created_at) };
  });
  return dateFormatObj;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
