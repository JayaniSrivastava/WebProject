
require("dotenv").config();

const session = require('express-session');
const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRouter');
const hostRoutes = require('./routes/hostRouter');
const { mongoConnect } = require('./utils/databaseUtils');

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false
}));

// ✅ THIS should come AFTER session
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use(authRoutes);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(hostRoutes);
app.use(userRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

mongoConnect(() => {
  console.log('MongoDB connected successfully 🚀');
  app.listen(3008, () => {
    console.log('Server running at http://localhost:3008');
  });
});
