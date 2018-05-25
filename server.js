const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express()

//Stored values in .env file
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const port = 3000;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
	//Uses CLIENT_ID and CLIENT_SECRET to get access code
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {
		'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
		},
		form: {
		grant_type: 'client_credentials'
		},
		json: true
	};
	
	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log('Authorized!')
  			var access_token = body.access_token,
				refresh_token = body.refresh_token;
  
			var options = {
				url: 'https://api.spotify.com/v1/me',
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};
			
			res.render('index');
		}
	})	
})

app.post('/', function (req, res) {
	res.render('index');

	//Get inputted artist from text field
	var artist = req.body.artist;
	console.log(artist);

	//TODO: make and call a method that converts artist into artistFormatted

	//TODO: call method in auth.js to get info about the artist from Spotify API.
})

app.listen(port, function () {
	console.log(`GreatestHits listening on port ${port}`)
})


/* 
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`

    request(url, function (req, res) {
      if(err) {
        res.render('index', {weather: null, error: 'Error, please try again.'});
      } else {
        let weather = JSON.parse(body);
        if(weather.main == undefined) {
          res.render('index', {weather: null, error: 'Error, please try again.'});
        } else {
          let weatherText = `It's ${weather.main.temp}\xB0${unitsLetter} in ${weather.name}! (${weather.sys.country})`;
          res.render('index', {weather: weatherText, error: null});
        }
      }
    }); */