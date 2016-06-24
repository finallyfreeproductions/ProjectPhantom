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
INSERT INTO users (username, email, role, password, password_hash) VALUES ('saj', 'saj@saj.com','role','password', '$2a$10$Nu4oBiV9kjMSD0sxnrhYkOLXgaHtfC3wb5xB5b8to.YtGvmVyz2ZC');
INSERT INTO users (username, email, role, password, password_hash) VALUES ('jeff', 'jeff@jeff.com','role','password', '$2a$10$Nu4oBiV9kjMSD0sxnrhYkOLXgaHtfC3wb5xB5b8to.YtGvmVyz2ZC');
