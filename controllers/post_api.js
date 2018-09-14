const mongoose = require('mongoose');
const Post = require('../models/Post');

const multer = require('multer');
const { multerOptions } = require('../handlers/multerOptions');

const jimp = require('jimp');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .limit(5)
    .skip(Number(req.params.skip))
    .sort({ created: 'desc' });

  res.json({ posts });
}

//create post
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
  await photo.write(`${saveDir}/uploads/posts/${req.body.photo}`);
  next();
}

exports.upload = multer(multerOptions).single('video');

exports.createPost = async (req, res) => {
  console.log('req createPost', req.body);
  if(req.body.youtube) {
    req.body.youtube = getYoutubeId(req.body.youtube);
  }
  const post = await (new Post(req.body)).save();
  res.status(200).json({ message: 'created new post'});
}


//get youtube id video
//there are 2 type of links
//https://www.youtube.com/watch?v=BqPgNYY3Ip0&list=RDgOgW5CpUUqI&index=7
//https://www.youtube.com/watch?v=F6VcyLeaO0s
function getYoutubeId(link) {
  let id = '';
  if(link.indexOf('list') > 0) {
    id = link.split('=')[1].split('&')[0];
  } else {
    id  = link.split('=')[1];
  }
  return id;
}
