const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db.json')
const db = low(adapter)

db.defaults({ books: [], users: [], transactions: [], sessions: []})
  .write()

db._.mixin({
    filterLowerCase: function(array, options = {}) {
        let arrFiltered = [];
        for (const prop in options) {
            arrFiltered = arrFiltered.concat(array.filter((item) => {
                return item[prop].toLowerCase().indexOf(options[prop].toLowerCase()) !== -1
            }))
        }
      return arrFiltered
    }
  })


module.exports = db