var mongoose = require('mongoose')

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  name: {
    type: String,
    required: true,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  }
})

var bcrypt = require('bcrypt')

// do something before we create new user
userSchema.pre('save', function (next) {
  var user = this
  // console.log('about to save user', this)
  // hash the password
  var hash = bcrypt.hashSync(user.password, 10)

  console.log('original password', user.password)
  console.log('hashed password', hash)

  // Override the cleartext password with the hashed one
  user.password = hash
  next()
})

userSchema.statics.findByEmail = function (givenEmail,next) {
  this.findOne({
    email: givenEmail,
  }, function(err,foundUser) {
    if (err) return 'user not found'
    next(null, foundUser)
    })
  }

userSchema.methods.validPassword = function (givenPassword) {
  console.log('givenPassword is', givenPassword)
  var hashedpassword = this.password
  return bcrypt.compareSync(givenPassword, hashedpassword)
}

// check if we hashed the given password is the same like the hashed password
// static vs instance methods?



var User = mongoose.model('User', userSchema)

module.exports = User
