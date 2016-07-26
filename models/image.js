/*
Here is where you setup a model for how to interface with the database.
*/

var orm = require('../config/orm.js');

var image = {
	findOne: function(condition, cb) {
	  orm.findOne('images', condition, function(res){
	      cb(res);
	  });
  },
	all: function(cb) {
		orm.all('images', function(res){
			cb(res);
		});
	},
	//cols and vals are arrays
	create: function(cols, vals, cb) {
		orm.create('images', cols, vals, function(res){
			cb(res);
		});
	},
	update: function(objColVals, condition, cb) {
		orm.update('images', objColVals, condition, function(res){
			cb(res);
		});
	},
	delete: function(condition, cb){
		orm.delete('images', condition, function(res){
			cb(res);
		});
	}
};

module.exports = image;
