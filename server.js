/*
Here is where you set up your server file.
express middleware.
*/
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')

var app = express();

//allow sessions
app.use(session({ secret: 'app', cookie: { maxAge: 60000 }}));
app.use(cookieParser());

//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// var application_controller = require('./controllers/application_controller.js');
// var cats_controller = require('./controllers/cats_controller.js');
var users_controller = require('./controllers/users_controller.js');

// app.use('/', application_controller);
app.use('/', users_controller);
// app.use('/users', users_controller);
app.use('/users', users_controller);

var PORT = 3000
app.listen(PORT, function() {
  console.log('This app is running on port ' + PORT);
});
