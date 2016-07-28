//bcrypt is used to hash the password as it goes into the database;
var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
//lines 5 and 6 is used for uploading images;
var multer = require('multer');
var upload = multer({ dest: './public/images' })
//line 9 and 10 will be used for mongodb
var mongo = require('mongodb');
var db = require('monk')('localhost/projectphantom');
var user = require('../models/user.js');
var image = require('../models/image.js');
var connection = require('../config/connection.js');

// create an admin area where the form will be. And connect it with a hidden drop down menu of numbers which will be the same number as the id of the client that you are working on... so it will be the image that will have a title and a dropdown menu in an admin area. and under each image will add comments.

// 1.the next few things i have to do are be able to upload pictures and be able to comment on in
// 2. and be able to add comments from the client side and have it sent through text or email or whatever i can find useful
// 3. once the client add's a comment push it to the database where it will remain on the page and the admin's will be able to see it
//4. be able to check off boxes that eventually turn into a meeter progress bar only the admin will see the checkboxes but the user will see the barcodescan
//5. but to add project for a specific user (pop up modal)
//be able to create an event for the users.
// "posts": posts: url
//"make sure when the user loggs in that they only see there stuff"
//"when an admin uploads an image have a drop down menu for each client and when that client id is selected have it posted to their profile page"
//"check the cats app on why it's not passing to the profile page"
//if user trys to sign in with the wrong password or email tell them that on the page
// when an admin uploads a picture it will have an id attached to it which will be equal to the client id.
//once we know if it's equal to a client id it will go to that specific client
//client will be able to comment with a checkbox that it is completed.


//this is the users_controller.js file
router.get('/', function(req,res) {
	user.all(function(data){ //grabbing .all users from the models file
		var hbsObject = {
			logged_in: req.session.logged_in,
			superAdmin: req.session.superAdmin,
			regAdmin: req.session.regAdmin,
			client: req.session.client
		}
			res.render('index', hbsObject);
	});
});

router.get('/new', function(req,res) {
	res.render('users/new');
});

router.get('/newAdmin', function(req,res) {
	res.render('users/newAdmin');
});

router.get('/newClient', function(req,res) {
	res.render('users/newClient');
});

router.get('/adminarea', function(req,res){
	var hbsObject = {
		logged_in: req.session.logged_in,
		superAdmin: req.session.superAdmin,
		regAdmin: req.session.regAdmin,
		client: req.session.client
	}

	var posts = db.get('posts');
	posts.find({},{},function(err, posts){
		// if client name is equal to req.session.user_email = user.email;
		// if theyre equal only grab the client name that is equal to it.
		// check out the nodeblog for when we searh by category only those show up.

		console.log('after find user_email', req.session.user_email);
		console.log(posts);

		res.render('users/adminArea',{
  			"title": 'Add Post',
  			"posts": posts,
				"hbsObject":hbsObject
  		});
	});
});

router.post('/commentimage', upload.single('mainimage'), function(req, res, next) {
  // Get Form Values
	var comments = db.get('comments');
  var title = req.body.title;
	var client = req.body.client;
  var date = new Date();

  // Check Image Upload
  if(req.file){
  	var mainimage = req.file.filename;
  } else {
  	var mainimage = 'noimage.jpg';
  }
  	// Form Validation
	req.checkBody('title','Title field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();
	if(errors){
		res.render('users/sign_in',{
			"errors": errors
		});

	} else {
		var comments = db.get('comments');
		comments.insert({
			"title": title,
			"client": client
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				res.redirect('/adminarea');
			}
		});
	}
});

//below this is the working image upload to mongo but now i need to transfer it over to mysql
router.post('/addimage', upload.single('mainimage'), function(req, res, next) {
  // Get Form Values
	var posts = db.get('posts');
  var title = req.body.title;
	var client = req.body.client;
  var date = new Date();

  // Check Image Upload
  if(req.file){
  	var mainimage = req.file.filename;
  } else {
  	var mainimage = 'noimage.jpg';
  }
  	// Form Validation
	req.checkBody('title','Title field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();
	if(errors){
		res.render('users/sign_in',{
			"errors": errors
		});

	} else {
		var posts = db.get('posts');
		posts.insert({
			"title": title,
			"mainimage": mainimage,
			"client": client
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				res.redirect('/adminarea');
			}
		});
	}
});

//THIS IS THE END OF WORKING IMAGE UPLOAD IN MONGO
// create an admin area where the form will be. And connect it with a hidden drop down menu of numbers which will be the same number as the id of the client that you are working on... so it will be the image that will have a title and a dropdown menu in an admin area. and under each image will add comments.
// now that i am working out of admin area. Try and get images and comments transfered over to there and get it to work that way for tomorrow.

router.get('/profile/:id', function(req, res){
	var id = req.params.id;

	var condition = "id = '" + id + "'";

	user.findOne(condition, function(user){
		var hbsObject = {
			logged_in: req.session.logged_in,
			superAdmin: req.session.superAdmin,
			regAdmin: req.session.regAdmin,
			client: req.session.client,
			user: user,
		}
		if (user){
			req.session.logged_in = true;
			if (req.session.user_id === user.id) {

				res.render('users/profile', hbsObject);
			} else {
				res.send('You do not belong here');
			}
		}else{
			res.send('========= line ____ in users_controller file')
		}
	});

});

router.get('/sign-out', function(req,res) {
  req.session.destroy(function(err) {
     res.redirect('/')
  })
});

router.post('/login', function(req, res) {
	var email = req.body.email;
	var condition = "email = '" + email + "'";

	user.findOne(condition, function(user){

		if (user){
			bcrypt.compare(req.body.password, user.password_hash, function(err, result) {
					if (result == true){

						req.session.logged_in = true;
						req.session.user_id = user.id;
						req.session.user_email = user.email;

						if (user.role == 'superAdmin') {
							req.session.superAdmin = true;
						} else if (user.role == 'admin') {
							req.session.regAdmin = true;
						} else if (user.role == 'client') {
							req.session.client = true;
						}
						// res.redirect("/profile/6");
						res.redirect("/");
					}else{
            res.send('You put in the wrong password.')
          }
			});
		}else{
			res.send('an account with this email does not exist - please sign up')
		}
	});
});

//below is the create route which creates a SuperAdmin
router.post('/create', function(req,res) {
	var queryString = "select * from users where email = '" + req.body.email + "'";

	connection.query(queryString, function(err, users) {

			if (err) throw err;

			if (users.length > 0){

				res.send('we already have an email or username for this account');

			}else{

				bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(req.body.password, salt, function(err, hash) {
              user.create(['username', 'email', 'role','password','password_hash'], [req.body.username, req.body.email, req.body.role, req.body.password, hash], function(user){

                req.session.username = req.body.username;//we need to grab the username from the form because we don't get it back from MySQL. If we wanted to grab it, then we'd have to do another sql query but it's unnecessary since we already have it here.
                req.session.user_email = req.body.email; //we need to grab the email from the form because we don't get it back from MySQL. If we wanted to grab it, then we'd have to do another sql query but it's unnecessary since we already have it here.
                req.session.logged_in = true;
                req.session.user_id = user.insertId; //the MySQL npm package returns the id of the record inserted with a key of insertId.
                res.redirect('/');
            	});
						});
				});
			}
	});
});
//end of super admin create router

// beginning of regular admin createAdmin Route
router.post('/createAdmin', function(req,res) {
	var queryString = "select * from users where email = '" + req.body.email + "'";

	connection.query(queryString, function(err, users) {

			if (err) throw err;

			if (users.length > 0){

				res.send('we already have an email or username for this account');

			}else{

				bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(req.body.password, salt, function(err, hash) {
              user.create(['username', 'email', 'role','password','password_hash'], [req.body.username, req.body.email, req.body.role, req.body.password, hash], function(user){

                req.session.username = req.body.username;//we need to grab the username from the form because we don't get it back from MySQL. If we wanted to grab it, then we'd have to do another sql query but it's unnecessary since we already have it here.
                req.session.user_email = req.body.email; //we need to grab the email from the form because we don't get it back from MySQL. If we wanted to grab it, then we'd have to do another sql query but it's unnecessary since we already have it here.
                req.session.logged_in = true;
                req.session.user_id = user.insertId; //the MySQL npm package returns the id of the record inserted with a key of insertId.

                res.redirect('/');
            	});
						});
				});
			}
	});
});

router.post('/createClient', function(req,res) {
	var queryString = "select * from users where email = '" + req.body.email + "'";

	connection.query(queryString, function(err, users) {

			if (err) throw err;

			if (users.length > 0){

				res.send('we already have an email or username for this account');

			}else{

				bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(req.body.password, salt, function(err, hash) {
              user.create(['username', 'email', 'role','password','password_hash'], [req.body.username, req.body.email, req.body.role, req.body.password, hash], function(user){

                req.session.username = req.body.username;//we need to grab the username from the form because we don't get it back from MySQL. If we wanted to grab it, then we'd have to do another sql query but it's unnecessary since we already have it here.
                req.session.user_email = req.body.email; //we need to grab the email from the form because we don't get it back from MySQL. If we wanted to grab it, then we'd have to do another sql query but it's unnecessary since we already have it here.
                req.session.logged_in = true;
                req.session.user_id = user.insertId; //the MySQL npm package returns the id of the record inserted with a key of insertId.

                res.redirect('/');
            	});
						});
				});
			}
	});
});

module.exports = router;

// router.get('/adminarea', function(req, res) {
// 	var id = req.body.id;
//
// 	var condition = "id = '" + id + "'";
// 		user.findOne(condition, function(user){
// 		 console.log('this is a user log', user);
//
// 			var hbsObject = {
// 				logged_in: req.session.logged_in,
// 				superAdmin: req.session.superAdmin,
// 				regAdmin: req.session.regAdmin,
// 				client: req.session.client,
// 				user: user,
// 			}
// 			res.render('users/adminArea', hbsObject);
// 		});
//
// });

// var posts = db.get('posts');
//
// posts.find({},{},function(err, posts){
// 	console.log('this is the long for what posts exactly is because i am not sure', posts);
// 	res.render('users/adminArea',{
// 			'title': 'Add Post',
// 			'posts': posts
// 		});
// });

//below this is the working image upload to mongo but now i need to transfer it over to mysql
// router.post('/addimage', upload.single('mainimage'), function(req, res, next) {
//   // Get Form Values
// 	var posts = db.get('posts');
//   var title = req.body.title;
//   var date = new Date();
//
//   // Check Image Upload
//   if(req.file){
//   	var mainimage = req.file.filename;
//   } else {
//   	var mainimage = 'noimage.jpg';
//   }
//   	// Form Validation
// 	req.checkBody('title','Title field is required').notEmpty();
//
// 	// Check Errors
// 	var errors = req.validationErrors();
// 	if(errors){
// 		res.render('users/sign_in',{
// 			"errors": errors
// 		});
//
// 	} else {
// 		var posts = db.get('posts');
// 		posts.insert({
// 			"title": title,
// 			"mainimage": mainimage
// 		}, function(err, post){
// 			if(err){
// 				res.send(err);
// 			} else {
// 				res.redirect('/profile/6');
// 			}
// 		});
// 	}
// });

//THIS IS THE END OF WORKING IMAGE UPLOAD IN MONGO

// saved image upload orig post route
// index.js continued
// router.post('/addimage', multer({ dest: './uploads/'}).single('mainimage'), function(req,res){
// 	console.log(req.body); //form fields
// 	/* example output:
// 	{ title: 'abc' }
// 	 */
// 	console.log(req.file); //form files
// 	/* example output:
//             { fieldname: 'upl',
//               originalname: 'grumpy.png',
//               encoding: '7bit',
//               mimetype: 'image/png',
//               destination: './uploads/',
//               filename: '436ec561793aa4dc475a88e84776b1b9',
//               path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
//               size: 277056 }
// 	 */
// 	res.status(204).end();
// });
//end saved image upload original post route

// router.post('/addimage', multer({dest: './uploads/'}).single('mainimage'), function(req,res){
// 	// console.log(req.body);
// 	console.log(req.file);
// 	console.log(req.body.title);
// 	console.log(req.file.fieldname);
// 	console.log(req.file.originalname);
// 	console.log(req.file.encoding);
// 	console.log(req.file.mimetype);
// 	console.log(req.file.destination);
// 	console.log(req.file.filename);
// 	console.log(req.file.path);
// 	console.log(req.file.size);
//
//
//
// 	if(req.file){
// 		var mainimage = req.file.filename;
// 	} else {
// 		var mainimage = 'noimage.jpg';
// 	}
// });
