const multer = require('multer');

exports.multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    console.log('req multer file', req.body);
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'Thats type isn\'t allowed'}, false);
    }
  }
};
