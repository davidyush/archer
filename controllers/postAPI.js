const mongoose = require('mongoose');
const Post = require('../models/Post');

const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .limit(5)
    .skip(Number(req.params.skip))
    .sort({ created: 'desc' });

  // console.log('posts', posts);
  res.json({ posts });
}

const multerOptions = multer({
	dest: `${saveDir}/uploads/posts/`,
});

const storage = multer.diskStorage({
  destination: `${saveDir}/uploads/posts/`,
  filename: function (req, file, cb) {
  	console.log('file', file);
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

exports.upload = multer({ storage: storage }).array('files');

exports.resize = (req, res, next) => {
	console.log('req.body', req.body);
	console.log('req.files', req.files);
	req.body.pics = [];
	req.files.forEach(file => {
		const mimetype = file.mimetype.split('/')[0];
		console.log('mimetype', mimetype);
		if(mimetype === 'video') {
			req.body.video = file.filename;
		}
		if(mimetype === 'image') {
			req.body.pics.push(file.filename);
		}
	});
	next();
}

exports.createPost = async (req, res) => {
	console.log('req.bodyyyy', req.body);
	if(req.body.pics.length === 1) {
		req.body.photo = req.body.pics[0];
		req.body.pics = null;
		delete req.body.pics;
	}
	if(req.body.youtube) {
    req.body.youtube = getYoutubeId(req.body.youtube);
  }
  const post = await (new Post(req.body)).save();
  res.status(200).json({ message: 'created new post'});
}


function getYoutubeId(link) {
  let id = '';
  if(link.indexOf('list') > 0) {
    id = link.split('=')[1].split('&')[0];
  } else {
    id  = link.split('=')[1];
  }
  return id;
}