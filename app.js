const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const expressValidator = require('express-validator');
const port = 3000;

// Load the configuration & Initialize Bookshelf & Knex.
const config  = require('./knexfile.js');
const knex = require('knex')(config[process.env.NODE_ENV]);
exports.bookshelf = require('bookshelf')(knex);

// init app
const app = express();

// define routes and pass in passport as a dependency
const index = require('./routes/index')(passport);
const users = require('./routes/users')(passport);
const articles = require('./routes/articles')(passport);
const categories = require('./routes/categories')(passport);
const manage = require('./routes/manage')(passport);

// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
  secret: 'fjei;awhg;hewro',
  resave: false,
  saveUninitialized: true
}));

// Init passport
app.use(passport.initialize());
app.use(passport.session());

require('./passport-config.js')(passport);

// Express messages
app.use(logger('dev'));
app.use(require('connect-flash')());
app.use((req, res, next) => {
	res.locals.messages = require('express-messages')(req, res);
  res.locals.user = req.user || null;
	next();
});

// Express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      const namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use((req, res, next) => {
  if (res.locals.user) {
    console.log("This user is logged in: " + JSON.stringify(res.locals.user.toJSON().username));
  }

  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/articles', articles);
app.use('/categories', categories);
app.use('/manage', manage);

app.listen(port, () => {
	console.log('Server started on port ' + port);
});