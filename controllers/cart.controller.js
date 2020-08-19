const shortid = require('shortid');

const db = require('../db')

module.exports = {
  index: (req, res) => {
    var sessionId = req.signedCookies.sessionId;
    
    if (!sessionId) {
      res.redirect('/books');
      return;
    }
    
    var cartHash = db
      .get('sessions')
      .find({id: sessionId})
      .value().cart || {};
    var cartArr = []
    for (const [key, value] of Object.entries(cartHash)) {
      var book = db.get('books').find({id: parseInt(key)}).value()
      cartArr.push({
        book,
        quantity: value
      })
    }
    res.render("cart/index", {cart: cartArr, csrfToken: req.csrfToken()})
  },
  completePayment: (req, res) => {
    var sessionId = req.signedCookies.sessionId;
    
    if (!sessionId) {
      res.redirect('/books');
      return;
    }
    
    var cartHash = db
      .get('sessions')
      .find({id: sessionId})
      .value().cart;
    for (const [key, value] of Object.entries(cartHash)) {
      var book = db.get('books').find({id: parseInt(key)}).value()
      db.get('transactions').push({
        id: shortid.generate(),
        bookId: book.id,
        userId: req.signedCookies.userId,
        quantity: value || 1,
        isComplete: false,
      }).write()
    }
    db.get('sessions')
      .find({id: sessionId})
      .setWith(`cart`, {}, Object)
      .write();
    
    res.redirect('/cart');
  },
  addToCart: (req, res, next) => {
    var bookId = req.params.bookId;
    var sessionId = req.signedCookies.sessionId;

    if (!sessionId) {
      res.redirect('/books');
      return;
    }

    var count = db
      .get('sessions')
      .find({id: sessionId})
      .get('cart.' + bookId, 0)
      .value();

    
    db.get('sessions')
      .find({id: sessionId})
      .setWith(`cart.${bookId}`, count + 1, Object)
      .write();
    
    res.redirect('/books');
  }
}