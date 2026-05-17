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
  res.render('addHome', {
    pageTitle: 'Add Home'
  });
};


exports.postAddHome = (req, res) => {
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
  const homeId = req.body.homeId;
  const db = getDB();

  db.collection('homes')
    .deleteOne({ _id: new mongodb.ObjectId(homeId) })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};


// -------------------- FAVOURITES --------------------

exports.addToFavourites = (req, res) => {
  const db = getDB();
  const homeId = req.body.homeId;

  db.collection('favourites')
    .updateOne(
      { homeId: new mongodb.ObjectId(homeId) },
      { $set: { homeId: new mongodb.ObjectId(homeId) } },
      { upsert: true }
    )
    .then(() => res.redirect('/favourites'))
    .catch(err => console.log(err));
};


exports.removeFromFavourites = (req, res) => {
  const db = getDB();
  const homeId = req.body.homeId;

  db.collection('favourites')
    .deleteOne({ homeId: new mongodb.ObjectId(homeId) })
    .then(() => res.redirect('/favourites'))
    .catch(err => console.log(err));
};


exports.getFavourites = (req, res) => {
  const db = getDB();

  db.collection('favourites')
    .find()
    .toArray()
    .then(favs => {
      if (favs.length === 0) return [];

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
  const db = getDB();
  const homeId = req.body.homeId;

  db.collection('booked')
    .updateOne(
      { homeId: new mongodb.ObjectId(homeId) },
      { $set: { homeId: new mongodb.ObjectId(homeId) } },
      { upsert: true }
    )
    .then(() => res.redirect('/booked'))
    .catch(err => console.log(err));
};


exports.getBooked = (req, res) => {
  const db = getDB();

  db.collection('booked')
    .find()
    .toArray()
    .then(items => {
      if (items.length === 0) return [];

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