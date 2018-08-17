const express = require('express');
// const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const routes = require('./routes/index');

const app = express();

//cors
// app.use(cors());

// json config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for vue app builds
function getPathOut(folder) {
  let currentPath = __dirname;
  currentPath = currentPath.split('/');
  currentPath.pop();
  currentPath = currentPath.join('/');
  currentPath = `${currentPath}/${folder}/dist`;
  return currentPath;
}

function kostilFolder(folder) {
  let currentPath = __dirname;
  currentPath = currentPath.split('/');
  currentPath.pop();
  currentPath = currentPath.join('/');
  currentPath = `${currentPath}/${folder}`;
  return currentPath;
}

const frontPath = express.static(kostilFolder('outspace'));
// const frontPath = express.static(getPathOut('archy'));
const adminPath = express.static(getPathOut('admin'));

app.use(frontPath);
app.use(adminPath);
app.use('/admin', adminPath);

app.use('/', routes);
module.exports = app;
