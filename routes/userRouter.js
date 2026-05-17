const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homes');

router.get('/', homeController.getHome);

router.get('/homes/:homeId', homeController.getHomeDetails);

router.get('/favourites', homeController.getFavourites);
router.post('/add-to-favourites', homeController.addToFavourites);
router.post('/favourites/remove', homeController.removeFromFavourites);

router.get('/booked', homeController.getBooked);
router.post('/book-home', homeController.bookHome);

module.exports = router;