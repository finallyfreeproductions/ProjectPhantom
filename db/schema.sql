CREATE DATABASE projectphantom;
USE projectphantom;

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
