	var path = require('path');
	var express = require('express');
	var exphbs = require('express-handlebars');
	var fs = require('fs');
	var app = express();
	var bodyParser = require('body-parser');

	var MongoClient = require('mongodb').MongoClient;
	var mongoDBName = "cs290_kramerje";

	var mongoURL = "mongodb://cs290_kramerje:cs290_kramerje@classmongo.engr.oregonstate.edu:27017/cs290_kramerje";
	var mongoDBDatabase;


	app.engine('handlebars', exphbs({defaultLayout: 'main'}));
	app.set('view engine', 'handlebars');

	var port = process.env.PORT || 3000;
	var blank = [];
	app.get('/', function (req, res) {
	  res.status(200).render('index', {data: blank});
	});

	app.use(express.static('public'));

	app.use(bodyParser.json());

	app.get('/alts', function (req, res, next) {
		var coinData = db.collection('coinData');
		var coinCursor = coinData.find({});

		coinCursor.toArray(function (err, coinDataArray) {
			if (err) {
				res.status(500).send("Error fetching coins from database.");
			} else {
				res.status(200).render('coincaller', {
			 		coin_array: coinDataArray
				});
			}
		})
	});

	app.get('/addCoin', function (req, res, next) {
		res.status(200).render('addCoin', {data: blank});
	});

	app.post('/addCoin', function (req, res) {
		var coinCollection = db.collection('coinData');
		coinCollection.insertOne( {
				coinFullName: req.body.coinFullName,
			   coinName: req.body.coinName,
			   currentPrice: req.body.currentPrice,
			   priceChange: req.body.priceChange,
			   marketCap: req.body.marketCap,
			   twentyFourHrVolume: req.body.twentyFourHrVolume,
			   dataset: req.body.dataset
			}
		);
	});

	app.get('*', function (req, res) {
  		res.status(404).render('error');
	});

	MongoClient.connect(mongoURL, function (err, client) {
		if (err) {
			throw err;
		}
		db = mongoDBDatabase = client.db(mongoDBName);
		app.listen(port, function () {
	  	console.log("Server is listening on port ", port);
		});
	});
