var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId;
var assert = require('assert'); //lo usamos para comprobar el estado de la conexión a la DB

// conecta con mongodb
// que corre en nuestra máquina(localhost)
// en el puerto 27017 (sale en el output de la consola al lanzar ./mongo)
// y usaremos la base de datos 'test'
var url = 'mongodb://localhost:27017/test'

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

// GET data
router.get('/get-data', function(req, res, next) {
	var resultArray = []; //aquí almacenaremos la colección que traemos de la VD y recorremos
	// abrimos conexión a la BD - ESTE BOLQUE CORRE ASINCRONAMENTE
	mongo.connect(url,{ useNewUrlParser: true }, function(error, client){
		assert.equal(null, error);

		var db = client.db('test');
  	// myAwesomeDB.collection('theCollectionIwantToAccess')

		// necesitamos almacenar los datos que obtengamos de la BD
		var usersCollection = db.collection('users').find() //traemos toda la colección

		// recorremos la colección que trajimos
		usersCollection.forEach(function(doc, error){ //first callback
			assert.equal(null, error);
			resultArray.push(doc);
		}, function(){ // second calback (triggered una vez tenemos todos los datos)
			client.close();
			res.render('index', {items: resultArray})
		});
	})

	//res.render('index'); // AQUI NO FUNCIONARIA PORQUE SE EJECUTARIA INMEDIATAMENTE
	// SIN HABERSE EJECUTADO LOS CALLBACKS QUE CONECTAN A LA BD Y TRAEN DATOS
});

// INSERT data
router.post('/insert', function(req, res, next) {
	var item = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	};


	// abrimos la conexión a la BD
	mongo.connect(url,{ useNewUrlParser: true }, function(error, client){ //al conectar ek callback nos puede dar un error de conexión ó
		var db = client.db('test');
		// devolvernos el acceso a la BD
		assert.equal(null, error);
		// creamos y usamos la colección llamada 'users'
		db.collection('users').insertOne(item, function(error, result){
			assert.equal(null, error);
			console.log('Item insert in DB collection');
			client.close();
		});
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

	mongo.connect(url,{ useNewUrlParser: true }, function(error, client){ //al conectar ek callback nos puede dar un error de conexión ó
		var db = client.db('test');
		// devolvernos el acceso a la BD
		assert.equal(null, error);
		// creamos y usamos la colección llamada 'users'
		db.collection('users').updateOne({"_id": objectId(id)}, {$set: item}, function(error, result){
			assert.equal(null, error);
			console.log('Item updated in DB collection');
			client.close();
		});
	});

	res.redirect('/get-data');
});


// DELETE data
router.post('/delete', function(req, res, next) {

	var id = req.body.id;

	mongo.connect(url,{ useNewUrlParser: true }, function(error, client){ //al conectar ek callback nos puede dar un error de conexión ó
		var db = client.db('test');
		// devolvernos el acceso a la BD
		assert.equal(null, error);
		// creamos y usamos la colección llamada 'users'
		db.collection('users').deleteOne({"_id": objectId(id)}, function(error, result){
			assert.equal(null, error);
			console.log('Item deleted from DB collection');
			client.close();
		});
	});
	
	res.redirect('/get-data');
});



module.exports = router;
