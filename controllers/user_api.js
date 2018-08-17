const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signIn = (req, res) => {
  console.log('here',req.body);
  const { email ,password } = req.body;
  const user = new User({ email });
  user.setPassword(password);
  user.setToken();
  console.log('asdasd', user);
  user
    .save()
    .then(userRecord => {
      res.json({ user: userRecord.toAuthJSON() });
    }).catch(err => {
      res.status(400).json({ err });
    });
}

exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log('user', user);
  if(user && user.token) {
    res.json({ user : user.toAuthJSON() });
  } else {
    res.status(400).json({ err: 'login error' });
  }
}

exports.verify = async(req, res, next) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, (err,decoded) => {
    if(err) {
      console.log('err',err);
    } else {
      // console.log('decoded', decoded);
      next();
    }
  });
}
