const mongoose = require('mongoose');
const Coloring = require('../models/Coloring');

const multer = require('multer');

const jimp = require('jimp');
const uuid = require('uuid');
const fs = require('fs');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

exports.getColorings = async (req, res) => {
  const colorings = await Coloring.find()
    .sort({ created: 'desc' });
  let shabbat = [], animals = [], hanukkah = [], purim = [], tubi = [], pesach = [];
  colorings.forEach(coloring => {
    if(coloring.tag === 'Шаббат')
      shabbat.push(coloring);
    else if(coloring.tag === 'Животные')
      animals.push(coloring);
    else if(coloring.tag === 'Ханука')
      hanukkah.push(coloring);
    else if(coloring.tag === 'Пурим')
      purim.push(coloring);
    else if(coloring.tag === 'Ту БиШват')
      tubi.push(coloring);
    else if(coloring.tag === 'Песах')
      pesach.push(coloring);
  });

  res.json({
    shabbat,
    animals,
    hanukkah,
    purim,
    tubi,
    pesach
  });
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
    await photo.write(`${saveDir}/uploads/colorings/thumbs/${req.body.photo}`);
  }
  if(req.files.pdf) {
    const extension = req.files.pdf[0].mimetype.split('/')[1];
    req.body.pdf = `${uuid.v4()}.${extension}`;
    await fs.open(`${saveDir}/uploads/colorings/pdfs`,'a+', function(err, some) {
      fs.writeFileSync(`${saveDir}/uploads/colorings/pdfs/${req.body.pdf}`,req.files.pdf[0].buffer, 'binary');
    });
  }
  next();
}

exports.uploadGen = multer(multerOptions).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

exports.createColoring = async (req, res) => {
  const coloring = await (new Coloring(req.body)).save();
  res.status(200).json({ message: 'created new coloring'});
}
