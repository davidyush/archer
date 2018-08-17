const mongoose = require('mongoose');
const Cross = require('../models/Cross');

const multer = require('multer');

const jimp = require('jimp');
const uuid = require('uuid');
const fs = require('fs');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

exports.getCrosses = async (req, res) => {
  const crosses = await Cross.find()
    .sort({ created: 'desc' });
  res.json({ crosses });
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
    await photo.write(`${saveDir}/uploads/crosses/thumbs/${req.body.photo}`);
  }
  if(req.files.pdf) {
    const extension = req.files.pdf[0].mimetype.split('/')[1];
    req.body.pdf = `${uuid.v4()}.${extension}`;
    await fs.open(`${saveDir}/uploads/crosses/pdfs`,'a+', function(err, some) {
      fs.writeFileSync(`${saveDir}/uploads/crosses/pdfs/${req.body.pdf}`,req.files.pdf[0].buffer, 'binary');
    });
  }
  next();
}

exports.uploadGen = multer(multerOptions).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

exports.createCross = async (req, res) => {
  const cross = await (new Cross(req.body)).save();
  res.status(200).json({ message: 'created new cross'});
}
