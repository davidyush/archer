const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');

const multer = require('multer');
const { multerOptions } = require('../handlers/multerOptions');

const jimp = require('jimp');
const uuid = require('uuid');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

function unique1(arr) {
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
}
function unique2(arr) {
    var uniq = {};
    arr.forEach(item => uniq[item] = true);
    return Object.keys(uniq);
}

exports.getGallery = async (req, res) => {
  const photos = await Gallery.find()
    .sort({ created: 'desc' });
  const cities = photos.map(photo => photo.city).sort();
  res.json({ cities, photos });
}

exports.getCities = async (req, res) => {
  const photos = await Gallery.find();
  const citiesTemp = photos.map(photo => photo.city).sort();
  const cities = unique1(citiesTemp);
  res.json({ cities });
}

exports.getGalleryByCity = async (req, res) => {
  const photos = await Gallery
    .find({ city: req.params.city })
    .sort({ created: 'desc' })
  const photosCity = photos.map(item => item.photo);
  res.json({ photosCity });
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
  await photo.write(`${saveDir}/uploads/gallery/${req.body.photo}`);
  next();
}

exports.upload = multer(multerOptions).single('photo');

exports.createGallery = async (req, res) => {
  console.log('req createGallery', req.body);

  const post = await (new Gallery(req.body)).save();
  res.status(200).json({ message: 'created new gallery'});
}
