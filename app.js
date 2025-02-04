var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./passportConfig');
const flash = require('connect-flash');



const mongoose = require('mongoose');
const uri = process.env.MONGOURI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error', error));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var authRouter = require('./routes/authRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const clientSessionStore = new session.MemoryStore();
app.use(session({
  secret: 'site-secret-key',
  resave: false,
  saveUninitialized: false,
  store: clientSessionStore,
  name: 'site-session-id', // Unique name for the site session
  cookie: {
      path: '/', // Restrict cookie to site routes
      maxAge: 3600000, // 1 hour
      secure:false
  }
}));

const adminSessionStore = new session.MemoryStore();
// Admin-side session configuration
app.use('/admin', session({
  secret: 'admin-secret-key',
  resave: false,
  saveUninitialized: false,
  store: adminSessionStore,
  name: 'admin-session-id', // Unique name for the admin session
  cookie: {
      path: '/admin', // Restrict cookie to admin routes
      maxAge: 3600000, // 1 hour
      secure:false
  }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  
  const err = req.flash('error');
  const success = req.flash('success');
  console.log("flash: ", err);
  console.log("flash: ", success);
  res.locals.errorMessage = err.length >0? err[0]: "";
  res.locals.successMessage = success.length>0? success[0]: "";
  next();
});


function clearCache(req, res, next) {
  res.set('Cache-Control', 'no-store,no-cache,must-revalidate,private');
  next();
}

app.use(clearCache);

app.use('/uploads', express.static('uploads'));
app.use(authRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const hbs = require('hbs');
hbs.registerHelper('multiply', (a, b) => a * b);
hbs.registerHelper('min', function(a, b) {
  return Math.min(a, b);
});

hbs.registerHelper('range', function(start, end) {
  let result = [];
  for (let i = start; i <= end; i++) {
      result.push(i);
  }
  return result;
});

module.exports = app;
