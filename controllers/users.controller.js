const shortid = require('shortid');

const db = require('../db');

const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const helper = require('../helper/helper')

var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dxg2xguho', 
    api_key: '528949878136419', 
    api_secret: 'fwS1Zn9VOGkEpLKgWUROj6o3RPg' 
  });


module.exports = {
  
  index: (req, res) => {
    if (req.query.q) {
      var q = req.query.q

      var matchedUsers = db.get('users')
              .filterLowerCase({name: q})
              .sortBy('name')
              .take(5)
              .value()
      res.render('users/index', {
        ...helper.pagination(matchedUsers, 'users', req.query, {
          curPage: req.query.page,
          perPage: 8,
          limitPage: 3,
        })
      })
      return
    }
    
    res.render('users/index', {
      ...helper.pagination(db.get('users').value(), 'users', req.query, {
          curPage: req.query.page,
          perPage: 8,
          limitPage: 3,
        })
    })
  },
  
  create: (req, res) => {
    res.render('users/create', { csrfToken: req.csrfToken() })
  },
  
  postCreate: (req, res) => {
    var data = {
      id: shortid.generate(),
      ...req.body,
      role: "customer",
      "wrongLoginCount": 0,
      "avatar": ""
    }
    
    data.password = bcrypt.hashSync(md5(req.body.password), saltRounds);
    
    if (!req.body.name) {
      res.render('users/create')
      return
    }
    db.get('users').push(data).write()
    res.redirect('/users')
  },
  
  edit: (req, res) => {
    var user = db.get('users').find({id: req.params.id}).value()
    res.render('users/edit', {user, csrfToken: req.csrfToken()})
  },
  
  profile: (req, res) => {
    var user = db.get('users').find({id: req.signedCookies.userId}).value()
    res.render('users/profile', {user, csrfToken: req.csrfToken()})
  },
  
  avatar: (req, res) => {
    var user = db.get('users').find({id: req.signedCookies.userId}).value()
    res.render('users/avatar', {user, csrfToken: req.csrfToken()})
  },
  
  putAvatar: (req, res) => {
    cloudinary.uploader.upload(req.file.path, { tags: 'express_sample' })
    .then(function (image) {
        let data = {
            avatar: image.secure_url || ''
        }
        return db.get('users').find({id: req.signedCookies.userId}).assign({...data}).write();
    })
    .finally(function () {
        res.redirect('/profile');
    })
  },
  
  putClientUpdate: (req, res) => {
    var matchUser = db.get('users').find({id: req.signedCookies.userId})
    if (!matchUser.value()) {
      res.redirect('/profile')
      return
    }
    matchUser.assign({...req.body}).write()
    res.redirect('/profile')
  },
  
  putUpdate: (req, res) => {
    var matchUser = db.get('users').find({id: req.signedCookies.userId})
    if (!matchUser.value()) {
      res.redirect('/users/index')
      return
    }
    matchUser.assign({...req.body}).write()
    res.redirect('/users')
  },
  
  delete: (req, res) => {
    var id = req.params.id || '';
    db.get('users')
      .remove({id})
      .write()
    res.redirect('back')
  }
}