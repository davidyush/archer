const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');

const multer = require('multer');
const { multerOptions } = require('../handlers/multerOptions');

const jimp = require('jimp');
const uuid = require('uuid');

//env
require('dotenv').config({ path: 'variables.env' });
const saveDir = process.env.NODE_ENV === 'production' ? '../outspace' : '../archy/public';

exports.getTeacherPosts = async (req, res) => {
  const teacherPosts = await Teacher.find()
    .sort({ created: 'desc' });
  res.json({ teacherPosts });
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
  await photo.write(`${saveDir}/uploads/teachers/${req.body.photo}`);
  next();
}

exports.upload = multer(multerOptions).single('photo');

exports.createTeacher = async (req, res) => {
  console.log('req createTeacher', req.body);

  const post = await (new Teacher(req.body)).save();
  res.status(200).json({ message: 'created new teacher'});
}
