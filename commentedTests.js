
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
