const mongoose = require('mongoose');
const Magazine = require('../models/Magazine');

const multer = require('multer');

const jimp = require('jimp');
const uuid = require('uuid');
const fs = require('fs');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

exports.getMagazines = async (req, res) => {
  const magazines = await Magazine.find()
    .sort({ created: 'desc' });
  res.json({ magazines });
}

//create
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, res , next) {
    next(null, true);
  }
}

exports.uploadBoth = async (req, res, next) => {
  if(!req.files) {
    next();
    return;
  }
  if(req.files.photo) {
    const extension = req.files.photo[0].mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.files.photo[0].buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`${saveDir}/uploads/magazines/thumbs/${req.body.photo}`);
  }
  if(req.files.pdf) {
    const extension = req.files.pdf[0].mimetype.split('/')[1];
    req.body.pdf = `${uuid.v4()}.${extension}`;
    await fs.open(`${saveDir}/uploads/magazine/pdfs`,'a+', function(err, some) {
      fs.writeFileSync(`${saveDir}/uploads/magazines/pdfs/${req.body.pdf}`,req.files.pdf[0].buffer, 'binary');
    });
  }
  next();
}

exports.uploadGen = multer(multerOptions).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

exports.createMagazine = async (req, res) => {
  const magazine = await (new Magazine(req.body)).save();
  res.status(200).json({ message: 'created new magazine'});
}
