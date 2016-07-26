CREATE DATABASE ProjectPhantom;
USE ProjectPhantom;

CREATE TABLE users
(
	id int NOT NULL AUTO_INCREMENT,
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	role varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	password_hash varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE images
(
  id      Int Unsigned Not Null Auto_Increment,
  name    VarChar(255) Not Null Default Untitled.txt,
  mime    VarChar(50) Not Null Default 'text/plain',
  size    BigInt Unsigned Not Null Default 0,
  data    MediumBlob Not Null,
  created DateTime Not Null,
  PRIMARY KEY (id)
  FOREIGN KEY (id) REFERENCES users(id)
);
-- var queryString = "select * from users where email = '" + req.body.email + "'";
--
-- connection.query(queryString, function(err, users) {
--
-- 		if (err) throw err;
--
-- 		if (users.length > 0){
--
-- 			res.send('we already have an email or username for this account');
--
-- 		}else{
--
-- 			bcrypt.genSalt(10, function(err, salt) {
-- 					bcrypt.hash(req.body.password, salt, function(err, hash) {
-- 						user.create(['username', 'email', 'role','password','password_hash'], [req.body.username, req.body.email, req.body.role, req.body.password, hash], function(user){
--
-- 							req.session.username = req.body.username;//we need to grab the username from the form because we don't get it back from MySQL. If we wanted to grab it, then we'd have to do another sql query but it's unnecessary since we already have it here.
-- 							req.session.user_email = req.body.email; //we need to grab the email from the form because we don't get it back from MySQL. If we wanted to grab it, then we'd have to do another sql query but it's unnecessary since we already have it here.
-- 							req.session.logged_in = true;
-- 							req.session.user_id = user.insertId; //the MySQL npm package returns the id of the record inserted with a key of insertId.
-- 							res.redirect('/');
-- 						});
-- 					});
-- 			});
-- 		}
-- });
