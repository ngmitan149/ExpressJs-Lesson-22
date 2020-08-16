const db = require('../db')

module.exports = {
  // permit: (req, res, next) => {
  //   var user = res.locals.user;
  //   if (user.isAdmin) {
  //     next()
  //   } else {
  //     res.render('index', {errors: ['Pemission denied']})
  //   }
  // },
  permit: (...allowed) => {
    const isAllowed = role => allowed.indexOf(role) > -1;

    return (req, res, next) => {
      if (res.locals.user && isAllowed(res.locals.user.role))
        next();
      else {
        res.render('index', {errors: ['Pemission denied']})
      }
    }
  }
}