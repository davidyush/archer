const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  role: {
    type: String,
    default: 'reader',
    required: true
  }
});

userSchema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
}

userSchema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
}

userSchema.methods.generateJWT = function generateJWT() {
  const result = jwt.sign({
      role: this.role,
      email: this.email
    },
    process.env.JWT_SECRET
  );
  return result;
}

userSchema.methods.setToken = function setToken() {
  this.token = this.generateJWT();
}

userSchema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    role: this.role,
    token: this.generateJWT()
  }
}

userSchema.plugin(uniqueValidator, {
  message: 'Validation Failed'
});


module.exports = mongoose.model("User", userSchema);
