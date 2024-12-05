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

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  /* const flashObj = req.flash();
  console.log("flash: ", req.flash()); */
  
  const err = req.flash('error');
  const success = req.flash('success');
  console.log("flash: ", err);
  console.log("flash: ", success);
  // console.log("flashObj", flashObj);
   /*console.log("flash error: ", flashObj["error"]);
  console.log("condition: ", flashObj["error"] && flashObj["error"].length > 0);
  console.log("mesg: ", (flashObj?.error?.length > 0 ) ? flashObj["error"][0]: "");
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg'); */
  //res.locals.errorMessage = (flashObj?.error?.length > 0) ? flashObj?.error[0] : ""; // For Passport error messages
  res.locals.errorMessage = err.length >0? err[0]: "";
  res.locals.successMessage = success.length>0? success[0]: "";

  //res.locals.successMessage = (flashObj?.success?.length > 0) ? flashObj?.success[0] : "";
  next();
});



app.use('/uploads', express.static('uploads'));
app.use(authRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);



function clearCache(req, res, next) {
  res.set('Cache-Control', 'no-store,no-cache,must-revalidate,private');
  next();
}

app.use(clearCache);


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


module.exports = app;
