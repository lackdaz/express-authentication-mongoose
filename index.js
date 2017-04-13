var express = require('express')
var ejsLayouts = require('express-ejs-layouts')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()

if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/express-authentication-test')
} else {
  mongoose.connect('mongodb://localhost/express-authentication')
}
mongoose.promise = global.promise

app.set('view engine', 'ejs')

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(ejsLayouts)

// setup the session
var session = require('express-session')
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUnitialized: true
}))

app.get('/', function (req, res) {
  res.render('index')
})



app.get('/profile', function (req, res) {
  res.render('profile')
})

app.use('/', require('./controllers/auth'))

var server
if (process.env.NODE_ENV === 'test') {
  server = app.listen(process.env.PORT || 4000)
} else {
  server = app.listen(process.env.PORT || 3000)
}

module.exports = server
