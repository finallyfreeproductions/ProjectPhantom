
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
