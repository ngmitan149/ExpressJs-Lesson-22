module.exports = {
  pagination: (list, prop, query, options) => {
    var queryStr = ''
    for (const [key, value] of Object.entries(query)) {
      if (key !== 'page')
        queryStr += `${key}=${value}&`
    }
    var curPage = parseInt(options.curPage) || 1
    var perPage = options.perPage || 8;
    var limitPage = options.limitPage || 3;
    var lastPage = Math.floor(list.length / perPage) + 1
    var start = (curPage - 1) * perPage;
    var end = curPage*perPage;
    
    return {
        [prop]: list.slice(start, end),
        pagination: {
          curPage,
          perPage,
          limitPage,
          lastPage,
        },
        queryStr
    }
  }
}