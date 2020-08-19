// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')
const multer  = require('multer')
const shortid = require('shortid');
const methodOverride = require('method-override')

const bookRoute = require('./routes/books.route')
const userRoute = require('./routes/users.route')
const transactionRoute = require('./routes/transactions.route')
const authRoute = require('./routes/auth.route')
const userClientRoute = require('./routes/user.client.route')
const cartRoute = require('./routes/cart.route')


const authMiddleware = require('./middlewares/auth.middleware')
const perMiddleware = require('./middlewares/permission.middleware')
const sessionMiddleware = require('./middlewares/session.middleware');




app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static('public'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET))

app.use(csurf({ cookie: true }))
app.use(methodOverride('_method'))
app.use(sessionMiddleware)


// https://expressjs.com/en/starter/basic-routing.html
app.use(["/transactions", "/profile"], authMiddleware.requireAuth, perMiddleware.permit("admin", "customer"))
app.use(["/books/private", "/users"], authMiddleware.requireAuth, perMiddleware.permit("admin"))


app.get('/', (request, response) => {
  response.render('index');
});

app.use('/cart', cartRoute)
app.use('/auth', authRoute)
app.use('/books', bookRoute);
app.use('/users', userRoute);
app.use('/transactions', transactionRoute)
app.use('/profile', userClientRoute)

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
