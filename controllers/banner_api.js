const mongoose = require('mongoose');
const Banner = require('../models/Banner');

const multer = require('multer');
const { multerOptions } = require('../handlers/multerOptions');

const jimp = require('jimp');
const uuid = require('uuid');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

exports.getBanner = async (req, res) => {
  const banners = await Banner.find()
    .sort({ created: 'desc' });
  res.json({ banner: banners[0] });
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
  await photo.resize(900, jimp.AUTO);
  await photo.write(`${saveDir}/uploads/banners/${req.body.photo}`);
  next();
}

exports.upload = multer(multerOptions).single('photo');

exports.createBanner = async (req, res) => {
  console.log('req createBanner', req.body);

  const post = await (new Banner(req.body)).save();
  res.status(200).json({ message: 'created new banner'});
}
