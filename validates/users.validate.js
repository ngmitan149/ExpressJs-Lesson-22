module.exports = {
  postCreate: (req, res, next) => {
    var errors = []
    
    if (req.body.name.length > 30) {
        errors.push("Name should less than 30 chars")
    }
    
    if (!req.body.email) {
        errors.push("Email is required")
    }
    
    if (!req.body.password) {
        errors.push("Password is required")
    }
    
    if (errors.length) {
        res.render('users/create', {
            errors,
            values: req.body,
        })
        return
    }

    next()
  }
}