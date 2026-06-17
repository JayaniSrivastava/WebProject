const { getDB } = require('../utils/databaseUtils');
const bcrypt = require('bcrypt');


// -------------------- SIGNUP --------------------

exports.getSignup = (req, res) => {
  res.render('signup', { pageTitle: 'Signup' });
};

exports.postSignup = (req, res) => {
  const db = getDB();
  const { email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => {
      return db.collection('users').insertOne({
        email: email,
        password: hash
      });
    })
    .then(() => res.redirect('/login'))
    .catch(err => console.log(err));
};


// -------------------- LOGIN --------------------

exports.getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Login' });
};

exports.postLogin = (req, res) => {
  const db = getDB();
  const { email, password } = req.body;

  db.collection('users')
    .findOne({ email: email })
    .then(user => {
      if (!user) return res.redirect('/login');

      return bcrypt.compare(password, user.password)
        .then(match => {
          if (!match) return res.redirect('/login');

          // ✅ SAVE SESSION PROPERLY
          req.session.user = {
            ...user,
            _id: user._id.toString()   // 🔥 important fix
          };

          return req.session.save(() => {
            res.redirect('/');
          });
        });
    })
    .catch(err => console.log(err));
};


// -------------------- LOGOUT --------------------

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
