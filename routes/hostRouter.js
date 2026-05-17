const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homes');

// HOME DETAILS ✅ FIXED
router.get("/home/:homeId", homeController.getHomeDetails);

// ADD HOME
router.get('/add-home', homeController.getAddHome);
router.post('/add-home', homeController.postAddHome);

// EDIT HOME
router.get('/edit-home/:homeId', homeController.getEditHome);
router.post('/edit-home', homeController.postEditHome);

// DELETE
router.post('/delete-home', homeController.postDeleteHome);

// FAVOURITES ✅ ADDED
router.post('/favourite', homeController.addToFavourites);
router.get('/favourites', homeController.getFavourites);

// BOOKING ✅ ADDED
router.post('/book', homeController.bookHome);
router.get('/booked', homeController.getBooked);

module.exports = router;