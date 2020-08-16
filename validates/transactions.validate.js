const db = require('../db');

module.exports = {
  postCreate: (req, res, next) => {
    var errors = []
    var bookId = db.get('books').find({id: req.body.bookId}).value()
    var userId = db.get('users').find({id: req.body.userId}).value()
    
    if (!bookId) {
        errors.push('The book does not exist!')
    }

    if (!userId) {
        errors.push('The user does not exist!')
    }

    if (errors.length) {
        var books = db.get('books').value();
        var users = db.get('users').value();
        res.render('transactions/create', {
            errors,
            values: req.body,
            books,
            users,
        })
        return
    }

    next()
  },
  complete: (req, res, next) => {
    var errors = []
    var matchTran = db.get('transactions').find({id: req.params.id}).value()
    if (!matchTran) {
        errors.push('The transaction does not exist!')
    }
    
    if (errors.length) {
      var transactions =  db.get('transactions').value();
      transactions = transactions.map(tran => {
        return {
          ...tran,
          bookInfo: db.get('books').find({id: tran.bookId}).value(),
          userInfo: db.get('users').find({id: tran.userId}).value()
        }
      })
      res.render('transactions/index', {
          errors,
          transactions
      })
      return
    }
    
    next()
  }
}