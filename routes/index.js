var express = require('express');
var router = express.Router();

const url = 'localhost:27017/test';

const monk = require('monk');
const db = monk(url);

var userData = db.get('users');

db.then(() => {
  console.log('Connected correctly to server')
})


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

// GET data
router.get('/get-data', function(req, res, next) {
	userData.find({})
		.then(function(collectionDocs){
			res.render('index', {items: collectionDocs});
		})
		.catch(function(error){
			console.log("----- ERROR GETTING COLLECTION-----");
		});
});

// INSERT data
router.post('/insert', function(req, res, next) {
	var item = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	};

	userData.insert(item)
		.then(function(dataReturned){
			console.log(dataReturned);
		})
		.catch(function(error){
			console.log("----- ERROR CREATING NEW ITEM-----");
		});

	res.redirect('/get-data');
});

// UPDATE data
router.post('/update', function(req, res, next) {

	var item = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	};

	var id = req.body.id;

	userData.update({'_id': db.id(id)}, item)
		.then(function(dataReturned){
			console.log(dataReturned);
		})
		.catch(function(error){
			console.log("----- ERROR UPDATING ITEM-----");
		});

	res.redirect('/get-data');
});


// DELETE data
router.post('/delete', function(req, res, next) {

	var id = req.body.id;

	userData.remove({'_id': db.id(id)})
		.then(function(dataReturned){
			console.log(dataReturned);
		})
		.catch(function(error){
			console.log("----- ERROR DELETING NEW ITEM-----");
		});
	
	res.redirect('/get-data');
});



module.exports = router;
