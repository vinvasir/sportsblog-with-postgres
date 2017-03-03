const repl = require('repl');

const bookshelf = require('./app.js').bookshelf;

const replServer = repl.start({});

replServer.context.Article = require('./models/article.js');
replServer.context.Category = require('./models/category.js');
replServer.context.Comment = require('./models/comment.js');
replServer.context.User = require('./models/user.js');