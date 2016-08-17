//bcrypt is used to hash the password as it goes into the database;
var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
//lines 5 and 6 is used for uploading images;
var multer = require('multer');
var upload = multer({ dest: './public/images' })
var user = require('../models/user.js');
var image = require('../models/image.js');
var connection = require('../config/connection.js');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

//new database stuff under
var mongo = require('mongodb');
var db = require('monk')('localhost/projectphantom');

router.post('/addcomment', upload.single('mainimage'), function(req, res, next) {
  // Get Form Values
	// var posts = db.get('posts');
	var body = req.body.body;
	var postid= req.body.postid;
	var now = new Date();


  	// Form Validation

	req.checkBody('body','body field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();
	if(errors){
		var posts = db.get('posts');
		posts.findById(postid, function(err, post){
			res.render('/',{
				"errors": errors,
				"post": post
			});
		});
	} else {
		var comment = {
			"body": body,
			"date": dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT")
		}

		var posts = db.get('posts');
		posts.update({
			"_id": postid
		},{
			$push:{
				"comments": comment
			}
		}, function(err, doc){
			if(err){
				throw err;
			} else {
				var users = db.get('users');
				users.findOne({"email": req.session.user_email}, function(err, doc) {
					if (doc.role == 'superAdmin') {
							res.redirect('/adminarea');
						} else if (doc.role == 'client') {
							res.redirect('/profile')
						}
				});

			}
		});
	}
});

router.post('/addimage', upload.single('mainimage'), function(req, res, next) {
  // Get Form Values
	var posts = db.get('posts');
	var title = req.body.title;
	var postid = req.body.postid
	var now = new Date();


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
		var posts = db.get('posts');
		posts.findById(postid, function(err, post){
			res.render('users/sign_in',{
				"errors": errors,
				"post":post
			});
		});
	} else {
		var addproject = {
			"title" : title,
			"mainimage" :mainimage,
			"date": dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT")
		}
		var posts = db.get('posts');
		posts.update({
			"_id": postid
		},{
			$push:{
				"projects": addproject
			}
		}, function(err, doc){
			if(err){
				throw err;
			} else {
				res.redirect('/adminarea')
			}
		});
	}
});

router.post('/addclient', upload.single('mainimage'), function(req, res, next) {
	var fullname = req.body.fullname;
	var clientname = req.body.clientname;
	var now = new Date();

  	// Form Validation
	req.checkBody('fullname',"client's full name is required").notEmpty();
	req.checkBody('clientname','Client Name field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();
	if(errors){
		res.render('users/profile',{
			"errors": errors
		});

	} else {
		var posts = db.get('posts');
		posts.insert({
			"fullname": req.body.fullname,
			"clientname": req.body.clientname,
			"serviceweb": req.body.website,
			"servicesocial": req.body.socialmedia,
			"servicemusic": req.body.musicstudio,
			"date": dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT")
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				res.redirect('/adminarea');
			}
		});
	}
});
module.exports = router;
//
// db.tests.update({
// 	"user": "jeff"
// },{
// 	$push:{
// 		"comments": "i am the user jeff"
// 	}
// }
