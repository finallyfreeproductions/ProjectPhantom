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
// ====== below this is access to upload and download zip
var AdmZip = require('adm-zip');


// ====== above this is access to upload and download zip

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
	var clientservices = req.body.serviceforclient;
	var postid = req.body.postid;
	var now = new Date();

	// var zip = new AdmZip();

	// add file directly
	// zip.addFile("test.txt", new Buffer("inner content of the file"), "entry comment goes here");
	// add local file
	// zip.addLocalFile("/Users/jeffyourman/Documents/ResumeV2/jeffreyimage.jpg");
	// // get everything as a buffer
	// var willSendthis = zip.toBuffer();
	// console.log('zip to buffer', willSendthis);
	// or write everything to disk
	// zip.writeZip("/Users/jeffyourman/Documents/files.zip");


  // Check Image Upload
  if(req.file){
  	var mainimage = req.file.filename;
		// zip.addLocalFile("/Users/jeffyourman/Documents/ResumeV2/" + mainimage);
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
			"clientservices": clientservices,
			"date": dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT")
		}

		// below use lines 79-95 in the profileroutes.js for gymapp
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
				// zip.writeZip("/Users/jeffyourman/Documents/progress.zip");
				res.redirect('/adminarea')
			}
		});
	}
});

router.post('/addclient', upload.single('mainimage'), function(req, res, next) {
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
			"services": req.body.myservices,
			// "serviceweb": req.body.website,
			// "servicesocial": req.body.socialmedia,
			// "servicemusic": req.body.musicstudio,
			// "logo": req.body.logo,
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

// 
// <tr>
//   {{#if this.servicesocial}}
//   <td style='color:black'>{{this.servicesocial}} servicesocial</td>
//   {{#if this.projects}}
//   {{#each this.projects}}
//         <td style='color:black'>{{this.date}}</td>
//   {{/each}}
//
//   {{else}}
//     <td style='color:black'>{{this.date}}</td>
//   {{/if}}
//     <!-- <td style='color:black'>{{this.date}}</td> -->
//   <td style='color:black'>8/2/16</td>
//   <td style='color:black'>Completed</td>
//   <td style='color:black'><button class='btn btn-primary' type="button" name="downloadzip">Download</button></td>
//   <td style='color:black'><button class='btn btn-warning' type='button' role="presentation" href="#" data-toggle="modal" data-target="#reviewproject">Review</button></td>
//   {{/if}}
// </tr>
// <tr>
//   {{#if this.servicemusic}}
//   <td style='color:black'>{{this.servicemusic}} servicemusic</td>
//   {{#if this.projects}}
//   {{#each this.projects}}
//         <td style='color:black'>{{this.date}}</td>
//   {{/each}}
//
//   {{else}}
//     <td style='color:black'>{{this.date}}</td>
//   {{/if}}
//     <!-- <td style='color:black'>{{this.date}}</td> -->
//   <td style='color:black'>8/2/16</td>
//   <td style='color:black'>Completed</td>
//   <td style='color:black'><button class='btn btn-primary' type="button" name="downloadzip">Download</button></td>
//   <td style='color:black'><button class='btn btn-warning' type='button' role="presentation" href="#" data-toggle="modal" data-target="#reviewproject">Review</button></td>
//   {{/if}}
// </tr>
// <tr>
//   {{#if this.logo}}
//   <td style='color:black'>{{this.logo}} logo</td>
//   {{#if this.projects}}
//   {{#each this.projects}}
//         <td style='color:black'>{{this.date}}</td>
//   {{/each}}
//
//   {{else}}
//     <td style='color:black'>{{this.date}}</td>
//   {{/if}}
//     <!-- <td style='color:black'>{{this.date}}</td> -->
//   <td style='color:black'>8/2/16</td>
//   <td style='color:black'>Completed</td>
//   <td style='color:black'><button class='btn btn-primary' type="button" name="downloadzip">Download</button></td>
//   <td style='color:black'><button class='btn btn-warning' type='button' role="presentation" href="#" data-toggle="modal" data-target="#reviewproject">Review</button></td>
//   {{/if}}
// </tr>
//
//
//
// ============
// {{#if this.projects}}
// {{#each this.projects}}
// {{/each}}
// {{else}}
