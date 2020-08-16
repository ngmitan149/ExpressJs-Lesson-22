const db = require('../db');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    login: (req,res) => {
        res.render('authentication/login')
    },
    postLogin: (req, res) => {
      var email = req.body.email;
      var password = req.body.password;

      var user = db.get('users').find({email}).value()

      if (!user) {
        res.render('authentication/login', {
          errors: [
            'User does not exist.'
          ],
        });
        return
      }
      
      if (user.wrongLoginCount + 1 > 3) {
        const msg = {
          to: 'nh0xtannh0xtan@gmail.com',
          from: 'ngmitan149@gmail.com',
          subject: 'Alert account security',
          text: '',
          html: `<p>Hi ${user.name},</p>
                 <p>Your account login the website with wrong password too many times. You should check your account!</p>`,
        };
        sgMail.send(msg);
      }
      
      if (user.wrongLoginCount > 4) {
        res.render('authentication/login', {
          errors: [
            'Your account is temporarily locked'
          ],
          values: {
            email,
          }
        });
        return
      }
      
      
      var match = bcrypt.compareSync(md5(password), user.password);
      

      if (!match) {
        db.get('users').find({email}).assign({wrongLoginCount: user.wrongLoginCount + 1}).write()
        res.render('authentication/login', {
          errors: [
            'Wrong password!'
          ],
          values: {
            email,
          }
        });
        return
      }

      res.cookie('userId', user.id, {
        signed: true,
      })
      res.redirect('/users')

    }
}