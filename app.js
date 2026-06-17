require("dotenv").config();

const session = require('express-session');
const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRouter');
const hostRoutes = require('./routes/hostRouter');
const { mongoConnect } = require('./utils/databaseUtils');

const app = express();

// ✅ Body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // IMPORTANT

// ✅ Session setup (use env)
app.use(session({
  secret: process.env.JWT_SECRET, // 🔥 FIXED
  resave: false,
  saveUninitialized: false
}));

// ✅ Locals middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// ✅ Routes
app.use(authRoutes);
app.use(hostRoutes);
app.use(userRoutes);

// ✅ View engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// ✅ Static
app.use(express.static(path.join(__dirname, 'public')));

// ✅ 404
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

// ✅ PORT FIX (MOST IMPORTANT)
const PORT = process.env.PORT || 3008;

// ✅ DB connect + server start
mongoConnect(() => {
  console.log('MongoDB connected successfully 🚀');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
