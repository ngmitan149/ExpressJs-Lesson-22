const shortid = require('shortid');
const db = require('../db');
const helper = require('../helper/helper')

var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dxg2xguho', 
    api_key: '528949878136419', 
    api_secret: 'fwS1Zn9VOGkEpLKgWUROj6o3RPg' 
  });

module.exports = {
  index: (req, res) => {
    var books = db.get('books').value();
    
    if (req.query.q) {
      var q = req.query.q

      var matchedUsers = db.get('books')
              .filterLowerCase({title: q})
              .sortBy('title')
              .take(5)
              .value()
      res.render('books/index', {
        ...helper.pagination(books, 'books', req.query,{
          curPage: req.query.page,
          perPage: 8,
          limitPage: 3,
        })
      })
      return
    }
    res.render('books/index', {
      ...helper.pagination(books, 'books', req.query, {
        curPage: req.query.page,
        perPage: 8,
        limitPage: 3,
      })
    })
  },
  
  indexClient: (req, res) => {
    var books = db.get('books').value();
    
    if (req.query.q) {
      var q = req.query.q

      var matchedUsers = db.get('books')
              .filterLowerCase({title: q})
              .sortBy('title')
              .value()
      res.render('books/client-index', {
        ...helper.pagination(
          matchedUsers, 
          'books',
          req.query,
          {
          curPage: req.query.page,
          perPage: 8,
          limitPage: 3,
        })
      })
      return
    }
    res.render('books/client-index', {
      ...helper.pagination(
        books, 
        'books',
        req.query,
        {
        curPage: req.query.page,
        perPage: 8,
        limitPage: 3,
      })
    })
  },
  
  create: (req, res) => {
    res.render('books/create')
  },
  
  postCreate: (req, res) => {
    var data = {
      id: shortid.generate(),
      ...req.body
    }
    if (!req.body.title) {
      res.render('book/create')
      return
    }
    db.get('books').push(data).write()
    res.redirect('/books')
  },
  
  edit: (req, res) => {
    var book = db.get('books').find({id: parseInt(req.params.id)}).value()
    res.render('books/edit', {book})
  },
  
  putUpdate: (req, res) => {
    var matchBook = db.get('books').find({id: parseInt(req.body.id)})
    if (!matchBook.value()) {
      res.redirect('/back')
      return
    }
    
    var files = req.files.map(file => {
        return cloudinary.uploader.upload(file.path, { tags: 'express_sample' })
        .then(image => {
            return image.url
        })
    })

    Promise.all(files).then(values => {
        let data = {
            title: req.body.title,
            description: req.body.description,
            images: JSON.stringify(values) || ''
        }
        matchBook.assign({...data}).write()

        res.redirect('/books/private')
    })
  },
  
  delete: (req, res) => {
    var id = req.params.id || '';
    db.get('books')
      .remove({id})
      .write()
    res.redirect('back')
  }
}