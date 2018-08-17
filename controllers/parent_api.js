const mongoose = require('mongoose');
const Parent = require('../models/Parent');

const multer = require('multer');
const { multerOptions } = require('../handlers/multerOptions');

const jimp = require('jimp');
const uuid = require('uuid');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

exports.getParentPosts = async (req, res) => {
  const parentPosts = await Parent.find()
    .sort({ created: 'desc' });
  res.json({ parentPosts });
}

//create
exports.resize = async (req, res, next) => {
  console.log('req resize file', req.body);
  if(!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`${saveDir}/uploads/parents/${req.body.photo}`);
  next();
}

exports.upload = multer(multerOptions).single('photo');

exports.createParent = async (req, res) => {
  console.log('req createParent', req.body);

  const post = await (new Parent(req.body)).save();
  res.status(200).json({ message: 'created new parent'});
}
