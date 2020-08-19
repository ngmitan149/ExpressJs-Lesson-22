const shortid = require('shortid');

const db = require('../db');
const helper = require('../helper/helper')

module.exports = {
  
  index: (req, res) => {
    var transactions = !res.locals.user.isAdmin ?
  db.get('transactions').filter({userId: res.locals.user.id}).value() :
  db.get('transactions').value();
    transactions = transactions.map(tran => {
      return {
        ...tran,
        bookInfo: db.get('books').find({id: tran.bookId}).value(),
        userInfo: db.get('users').find({id: tran.userId}).value()
      }
    })
    res.render('transactions/index', {
      ...helper.pagination(transactions, 'transactions', req.query, {
        curPage: req.query.page,
        perPage: 8,
        limitPage: 3,
      })
    })
  },
  
  create: (req, res) => {
    var books = db.get('books').value();
    var users = db.get('users').value();
    res.render('transactions/create', {books, users, csrfToken: req.csrfToken()})
  },
  
  postCreate: (req, res) => {
    var data = {
      id: shortid.generate(),
      ...req.body
    }
    db.get('transactions').push(data).write()
    res.redirect('/transactions')
  },
  
  complete: (req, res) => {
    var id = req.params.id || '';
    var tran = db.get('transactions')
      .find({id}).value();
    tran.isCompleted = !tran.isCompleted;
    db.get('transactions')
      .find({id})
      .assign({...tran})
      .write()
    res.redirect('back')
  },
  
  delete: (req, res) => {
    var id = req.params.id || '';
    db.get('transactions')
      .remove({id})
      .write()
    res.redirect('back')
  }
}