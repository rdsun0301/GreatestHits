const express = require('express');
const bodyParser = require('body-parser');
const app = express()

const auth = require('./auth');

const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
	res.render('./index');
})

app.post('/', function (req, res) {
	res.render('./index');

	//Get inputted artist from text field
	var artist = req.body.artist;

	//TODO: make and call a method that converts artist into artistFormatted

	//TODO: call method in auth.js to get info about the artist from Spotify API.
})

app.listen(port, function () {
	console.log(`GreatestHits listening on port ${port}`)
})