var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mongoose connecting correctly to mongo db");
});

var Schema = mongoose.Schema;

var userDataSchema = new Schema({
	title: {type: String, required: true},
	content: String,
	author: String
}, {collection: 'users'});

var userData = mongoose.model('UserData', userDataSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

// GET data
router.get('/get-data', function(req, res, next) {
	userData.find()
		.then(function(docs){
			res.render('index', {items: docs});
		})
});

// INSERT data
router.post('/insert', function(req, res, next) {
	var item = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	};

	var data = new userData(item);
	data.save(function(err){
		if (err) {
			console.log("-------------- ERROR CREATING --------------");
			res.render('index', {error_message: err._message})
		} else {
			res.redirect('/get-data');
		}
	});

});

// UPDATE data
router.post('/update', function(req, res, next) {
	var id = req.body.id;

	userData.findById(id, function(err, doc){
		if (err) {
			console.log("no entry found!");
		}

		doc.title = req.body.title;
		doc.content = req.body.content;
		doc.author = req.body.autho;

		doc.save(function(errUpdate){
			if (errUpdate) {
				console.log("-------------- ERROR UPDATING --------------");
				res.render('index', {error_message: errUpdate._message})
			} else {
				res.redirect('/get-data');
			}
		});
	})

});


// DELETE data
router.post('/delete', function(req, res, next) {

	var id = req.body.id;

	userData.findByIdAndRemove(id).exec();
	
	res.redirect('/get-data');
});

module.exports = router;
