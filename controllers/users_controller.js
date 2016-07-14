var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var user = require('../models/user.js');
var connection = require('../config/connection.js');

// 1.the next few things i have to do are be able to upload pictures and be able to comment on in
// 2. and be able to add comments from the client side and have it sent through text or email or whatever i can find useful
// 3. once the client add's a comment push it to the database where it will remain on the page and the admin's will be able to see it
//4. be able to check off boxes that eventually turn into a meeter progress bar only the admin will see the checkboxes but the user will see the barcodescan
//5. but to add project for a specific user (pop up modal)
//be able to create an event for the users.

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

router.get('/', function(req,res) {
	res.render('users/sign_in');
});

router.get('/newAdmin', function(req,res) {
	res.render('users/newAdmin');
});

router.get('/newClient', function(req,res) {
	res.render('users/newClient');
});


router.get('/:id/profile', function(req, res){
	var hbsObject = {
		logged_in: req.session.logged_in,
		superAdmin: req.session.superAdmin,
		regAdmin: req.session.regAdmin,
		client: req.session.client
	}

	var id = req.params.id;

	var condition = "id = '" + id + "'";

	user.findOne(condition, function(user){
		console.log("this is the user log", user.id);
//this is not working because it always thinks that the param id is equal to the id that i am logged into
		if (user){
			req.session.logged_in = true;
			if (req.session.user_id === user.id) {
				res.render('users/profile', hbsObject); //try this later {user:user, hbsObject}
			} else {
				res.send('fuck this shit...');
			}
		}else{
			res.send('idk why this is here')
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
						console.log('this is the req.session.user_id in login route', req.session.user_id);
						console.log('this is the find one userid in login route', user.id);
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
