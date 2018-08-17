const mongoose = require('mongoose');
const Game = require('../models/Game');

const multer = require('multer');

const jimp = require('jimp');
const uuid = require('uuid');
const fs = require('fs');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

exports.getGames = async (req, res) => {
  const games = await Game.find()
    .sort({ created: 'desc' });
  res.json({ games });
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
    await photo.write(`${saveDir}/uploads/games/thumbs/${req.body.photo}`);
  }
  if(req.files.pdf) {
    const extension = req.files.pdf[0].mimetype.split('/')[1];
    req.body.pdf = `${uuid.v4()}.${extension}`;
    await fs.open(`${saveDir}/uploads/games/pdfs`,'a+', function(err, some) {
      fs.writeFileSync(`${saveDir}/uploads/games/pdfs/${req.body.pdf}`,req.files.pdf[0].buffer, 'binary');
    });
  }
  next();
}

exports.uploadGen = multer(multerOptions).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);

exports.createGame = async (req, res) => {
  const game = await (new Game(req.body)).save();
  res.status(200).json({ message: 'created new game'});
}
