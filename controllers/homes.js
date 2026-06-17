const { getDB } = require('../utils/databaseUtils');
const mongodb = require('mongodb');


// -------------------- HOME --------------------

exports.getHome = (req, res) => {
  const db = getDB();

  db.collection('homes')
    .find()
    .toArray()
    .then(homes => {
      res.render('home', {
        registeredHomes: homes,
        pageTitle: 'All Homes'
      });
    })
    .catch(err => console.log(err));
};


exports.getAddHome = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  res.render('addHome', {
    pageTitle: 'Add Home'
  });
};


exports.postAddHome = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const db = getDB();

  const home = {
    houseName: req.body.houseName,
    city: req.body.city,
    houseNo: req.body.houseNo,
    address: req.body.address,
    image: req.body.image,
    price: Number(req.body.price) || 0
  };

  db.collection('homes')
    .insertOne(home)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};


exports.getHomeDetails = (req, res) => {
  const homeId = req.params.homeId;
  const db = getDB();

  db.collection('homes')
    .findOne({ _id: new mongodb.ObjectId(homeId) })
    .then(home => {
      if (!home) return res.redirect('/');

      res.render('homeDetails', {
        home: home,
        pageTitle: 'Home Details'
      });
    })
    .catch(err => console.log(err));
};


// -------------------- EDIT / DELETE --------------------

exports.getEditHome = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const homeId = req.params.homeId;
  const db = getDB();

  db.collection('homes')
    .findOne({ _id: new mongodb.ObjectId(homeId) })
    .then(home => {
      if (!home) return res.redirect('/');

      res.render('edit-home', {
        pageTitle: 'Edit Home',
        home: home
      });
    })
    .catch(err => console.log(err));
};


exports.postEditHome = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const homeId = req.body.homeId;
  const db = getDB();

  db.collection('homes')
    .updateOne(
      { _id: new mongodb.ObjectId(homeId) },
      {
        $set: {
          houseName: req.body.houseName,
          city: req.body.city,
          houseNo: req.body.houseNo,
          address: req.body.address,
          image: req.body.image,
          price: Number(req.body.price) || 0
        }
      }
    )
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};


exports.postDeleteHome = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const homeId = req.body.homeId;
  const db = getDB();

  db.collection('homes')
    .deleteOne({ _id: new mongodb.ObjectId(homeId) })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};


// -------------------- FAVOURITES --------------------

exports.addToFavourites = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const db = getDB();
  const homeId = req.body.homeId;
  const userId = req.session.user._id;

  db.collection('favourites')
    .updateOne(
      { homeId: new mongodb.ObjectId(homeId), userId: userId },
      { $set: { homeId: new mongodb.ObjectId(homeId), userId: userId } },
      { upsert: true }
    )
    .then(() => res.redirect('/favourites'))
    .catch(err => console.log(err));
};


exports.removeFromFavourites = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const db = getDB();
  const homeId = req.body.homeId;
  const userId = req.session.user._id;

  db.collection('favourites')
    .deleteOne({
      homeId: new mongodb.ObjectId(homeId),
      userId: userId
    })
    .then(() => res.redirect('/favourites'))
    .catch(err => console.log(err));
};


exports.getFavourites = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const db = getDB();
  const userId = req.session.user._id;

  db.collection('favourites')
    .find({ userId: userId })
    .toArray()
    .then(favs => {
      const homeIds = favs.map(f => f.homeId);

      return db.collection('homes')
        .find({ _id: { $in: homeIds } })
        .toArray();
    })
    .then(homes => {
      res.render('favourites', {
        pageTitle: 'Favourites',
        homes: homes
      });
    })
    .catch(err => console.log(err));
};


// -------------------- BOOKINGS --------------------

exports.bookHome = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const db = getDB();
  const homeId = req.body.homeId;
  const userId = req.session.user._id;

  db.collection('booked')
    .updateOne(
      { homeId: new mongodb.ObjectId(homeId), userId: userId },
      { $set: { homeId: new mongodb.ObjectId(homeId), userId: userId } },
      { upsert: true }
    )
    .then(() => res.redirect('/booked'))
    .catch(err => console.log(err));
};


exports.getBooked = (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const db = getDB();
  const userId = req.session.user._id;

  db.collection('booked')
    .find({ userId: userId })
    .toArray()
    .then(items => {
      const homeIds = items.map(item => item.homeId);

      return db.collection('homes')
        .find({ _id: { $in: homeIds } })
        .toArray();
    })
    .then(homes => {
      res.render('booked', {
        pageTitle: 'Booked Homes',
        homes: homes
      });
    })
    .catch(err => console.log(err));
};