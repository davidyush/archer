const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errorHandler');

const postController = require('../controllers/post_api');
const teacherController = require('../controllers/teacher_api');
const taleController = require('../controllers/tale_api');
const parentController = require('../controllers/parent_api');
const magazineController = require('../controllers/magazine_api');
const galleryController = require('../controllers/gallery_api');
const bannerController = require('../controllers/banner_api');
const gameController = require('../controllers/game_api');
const crossController =require('../controllers/cross_api');
const coloringController = require('../controllers/coloring_api');

const userController = require('../controllers/user_api');

//main app
router.get('/', (req, res) => {
  res.sendFile('index.html');
});

//admin app
router.get('/admin', (req, res) => {
  res.sendFile('admin/index.html');
});

//api get
router.get('/api/getPosts/:skip', catchErrors(postController.getPosts));
router.get('/api/getTeacherPosts', catchErrors(teacherController.getTeacherPosts));
router.get('/api/getTalePosts', catchErrors(taleController.getTalePosts));
router.get('/api/getParentPosts', catchErrors(parentController.getParentPosts));
router.get('/api/getMagazines', catchErrors(magazineController.getMagazines));
router.get('/api/getGallery', catchErrors(galleryController.getGallery));
router.get('/api/getGalleryCities', catchErrors(galleryController.getCities));
router.get('/api/getGalleryByCity/:city', catchErrors(galleryController.getGalleryByCity));
router.get('/api/getBanner', catchErrors(bannerController.getBanner));
router.get('/api/getGames', catchErrors(gameController.getGames));
router.get('/api/getCrosses', catchErrors(crossController.getCrosses));
router.get('/api/getColorings', catchErrors(coloringController.getColorings));

//user
// router.post('/api/signin', userController.signIn);
router.post('/api/login', catchErrors(userController.logIn));
router.post('/api/verify', userController.verify);

//api create
router.post('/api/createPost',
  postController.upload,
  userController.verify,
  catchErrors(postController.resize),
  catchErrors(postController.createPost)
);

router.post('/api/createTale',
  taleController.upload,
  userController.verify,
  catchErrors(taleController.resize),
  catchErrors(taleController.createTale)
);

router.post('/api/createParent',
  parentController.upload,
  userController.verify,
  catchErrors(parentController.resize),
  catchErrors(parentController.createParent)
);

router.post('/api/createTeacher',
  teacherController.upload,
  userController.verify,
  catchErrors(teacherController.resize),
  catchErrors(teacherController.createTeacher)
);

router.post('/api/createMagazine',
  magazineController.uploadGen,
  catchErrors(magazineController.uploadBoth),
  catchErrors(magazineController.createMagazine)
);

router.post('/api/createGallery',
  galleryController.upload,
  userController.verify,
  catchErrors(galleryController.resize),
  catchErrors(galleryController.createGallery)
);

router.post('/api/createBanner',
  bannerController.upload,
  userController.verify,
  catchErrors(bannerController.resize),
  catchErrors(bannerController.createBanner)
);

router.post('/api/createGame',
  gameController.uploadGen,
  userController.verify,
  catchErrors(gameController.uploadBoth),
  catchErrors(gameController.createGame)
);

router.post('/api/createCross',
  crossController.uploadGen,
  userController.verify,
  catchErrors(crossController.uploadBoth),
  catchErrors(crossController.createCross)
);

router.post('/api/createColoring',
  coloringController.uploadGen,
  userController.verify,
  catchErrors(coloringController.uploadBoth),
  catchErrors(coloringController.createColoring)
);

module.exports = router;
