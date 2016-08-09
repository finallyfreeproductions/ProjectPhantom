//bcrypt is used to hash the password as it goes into the database;
var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
//lines 5 and 6 is used for uploading images;
var multer = require('multer');
var upload = multer({ dest: './public/images' })
//line 9 and 10 will be used for mongodb
// var mongo = require('mongodb');
// var db = require('monk')('localhost/projectphantom');
var user = require('../models/user.js');
var image = require('../models/image.js');
var connection = require('../config/connection.js');
var bodyParser = require('body-parser');

//new database stuff under

var mongojs = require('mongojs');
var databaseUrl = "projectphantom";
var collections = ["users", "posts"];
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

//new database stuff over

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


router.get('/', function(req,res) {
	// find everything
	db.users.find(function (err, docs) {
	    // docs is an array of all the documents in mycollection
			var hbsObject = {
				logged_in: req.session.logged_in,
				superAdmin: req.session.superAdmin,
				regAdmin: req.session.regAdmin,
				client: req.session.client
			}
				res.render('index', hbsObject);
	})
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

//================
//pull the images from mongo that are equal to the id of the user. and only show those.
//================
router.get('/adminarea', function(req,res){
//i have to figure out the best way for the client to see their own image.
	db.posts.find(function (err, docs) {
		// if client name is equal to req.session.user_email = user.email;
		// if theyre equal only grab the client name that is equal to it.
		// check out the nodeblog for when we searh by category only those show up.
		// req.session.logged_in = true;
		if (req.session.superAdmin) {

			res.render('users/adminArea',{
	  			"title": 'Add Post',
					"logged_in": req.session.logged_in,
					"superAdmin": req.session.superAdmin,
					"regAdmin": req.session.regAdmin,
					"client": req.session.client,
	  			"docs": docs
	  		});
		} else {
			res.send('You do not belong here');
		}

	});
});



//THIS IS THE END OF WORKING IMAGE UPLOAD IN MONGO

router.get('/sign-out', function(req,res) {
  req.session.destroy(function(err) {
     res.redirect('/')
  })
});

router.post('/login', function(req, res) {

	db.users.findOne({"email": req.body.email}, function(err, doc) {

	  if (doc) {

	    bcrypt.compare(req.body.password, doc.password, function(err,result) {

	      if (result == true) {
	        req.session.logged_in = true;
	        req.session.user_email = doc.email;
	        req.session.username = doc.username;

	        if (doc.role == 'superAdmin') {
	          req.session.superAdmin = true;
						res.redirect('/adminarea');
	        } else if (doc.role == 'admin') {
	          req.session.regAdmin = true;
	        } else if (doc.role == 'client') {
	          req.session.client = true;
						res.redirect('/profile');
	        }



	      } else {
	        res.send('you entered the wrong password');
	      }
	    });
	  }
	});
});

//below is the create route which creates a SuperAdmin
router.post('/create', function(req,res) {
	db.users.find({"email": req.body.email}, function (err, docs) {
		if (docs.length > 0) {
			res.send('please create an account');
		} else {
		// docs is an array of all the documents in mycollection
			bcrypt.genSalt(10, function(err,salt){
				bcrypt.hash(req.body.password, salt, function(err,hash){
					db.users.save({fullname: req.body.fullname, username: req.body.username, email: req.body.email, password: hash, role:req.body.role}, function(err, saved){
						if (err) {
							console.log(err);
						} else {
							req.session.logged_in = true;
							req.session.username = req.body.username;
							req.session.user_email = req.body.email;
							// req.session.username = req.body.username;

							res.redirect('/');
						}
					});
				});
			});
		}
	})
});


router.post('/createclient', function(req,res) {
	db.users.find({"username": req.body.username}, function (err, docs) {
    if (docs.length > 0) {
      res.send('please create an account');
    } else {
    // docs is an array of all the documents in mycollection
      bcrypt.genSalt(10, function(err,salt){
        bcrypt.hash(req.body.password, salt, function(err,hash){
          db.users.save({username: req.body.username, email: req.body.email, password: hash, role:req.body.role}, function(err, saved){
            if (err) {
              console.log(err);
            } else {
              req.session.logged_in = true;
              req.session.username = req.body.username;
              req.session.user_email = req.body.email;
              // req.session.username = req.body.username;

              res.redirect('/adminarea');
            }
          });
        });
      });
    }
  })
});

router.get('/profile', function(req, res){
  db.users.findOne({"email":req.session.user_email}, function(err, docs) {
		db.posts.find({"client": req.session.username}, function (err, doc) {
			// docs is an array of all the documents in mycollection
				var hbsObject = {
					logged_in: req.session.logged_in,
					docs:docs,
					doc:doc
				}
			res.render('users/profile', hbsObject);
		})


  });
});



// router.post('/addcomment', upload.single('mainimage'), function(req, res, next) {
//   // Get Form Values
// 	// var posts = db.get('posts');
// 	var body = req.body.body;
// 	var postid= req.body.postid;
//   var commentdate = new Date();
//
//   	// Form Validation
//
// 	req.checkBody('body','body field is required').notEmpty();
//
// 	// Check Errors
// 	var errors = req.validationErrors();
// 	if(errors){
// 		var posts = db.get('posts');
// 		posts.findById(postid, function(err, post){
// 			res.render('/',{
// 				"errors": errors,
// 				"post": post
// 			});
// 		});
// 	} else {
// 		var comment = {
// 			"body": body,
// 			"commentdate": commentdate
// 		}
// 		var posts = db.get('posts');
// 		posts.update({
// 			"_id": postid
// 		},{
// 			$push:{
// 				"comments": comment
// 			}
// 		}, function(err, doc){
// 			if(err){
// 				throw err;
// 			} else {
// 				res.redirect('/adminarea');
// 			}
// 		});
// 	}
// });
//
// router.post('/addimage', upload.single('mainimage'), function(req, res, next) {
//   // Get Form Values
// 	var posts = db.get('posts');
//   var title = req.body.title;
// 	var client = req.body.client;
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
// 			"mainimage": mainimage,
// 			"client": client
// 		}, function(err, post){
// 			if(err){
// 				res.send(err);
// 			} else {
// 				res.redirect('/adminarea');
// 			}
// 		});
// 	}
// });
module.exports = router;

// // working user profile route.
// router.get('/profile/:id', function(req, res){
// 	var id = req.params.id;
//
// 	var condition = "id = '" + id + "'";
//
// 	user.findOne(condition, function(user){
// 		var hbsObject = {
			// logged_in: req.session.logged_in,
			// superAdmin: req.session.superAdmin,
			// regAdmin: req.session.regAdmin,
			// client: req.session.client,
			// user: user,
// 		}
// 			req.session.logged_in = true;
// 			if (req.session.user_id === user.id) {
//
// 				res.render('users/profile', hbsObject);
// 			} else {
// 				res.send('You do not belong here');
// 			}
// 	});
// });



// the one profile below works except for the fact that the images don't show up but i beleive that has to do with what i am rendering
// router.get('/profile/:id', function(req, res){
// 	var id = req.params.id;
//
// 	var condition = "id = '" + id + "'";
//
// 	user.findOne(condition, function(user){
// 		var posts = db.get('posts');
// 		posts.find({},{},function(err, posts){
// 			// if client name is equal to req.session.user_email = user.email;
// 			// if theyre equal only grab the client name that is equal to it.
// 			// check out the nodeblog for when we searh by category only those show up.
// 			// req.session.logged_in = true;
// 			req.session.logged_in = true;
//
// 			if (req.session.user_id === user.id) {
//
// 				res.render('index',{
// 						"title": 'Add Post',
// 						"logged_in": req.session.logged_in,
// 						"superAdmin": req.session.superAdmin,
// 						"regAdmin": req.session.regAdmin,
// 						"client": req.session.client,
// 						"posts": posts,
// 						"user": user
// 					});
// 			} else {
// 				res.send('You do not belong here');
// 			}
// 		});
// 	});
// });
