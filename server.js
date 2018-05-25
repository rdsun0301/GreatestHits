const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express()

const auth = require('./lib/auth');

const port = 3000;
//From registering Spotify app
const clientID = '0cc85a786e754b958fa0096973baf894';
const clientSecret = 'd37be6a43f724ba1ae4b5fc02b8b8ac7';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
	//Uses clientID and clientSecret to get access code
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {
		'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
		},
		form: {
		grant_type: 'client_credentials'
		},
		json: true
	};
	console.log('got this far');
	request.post(authOptions, function(error, response, body) {
		console.log(response.statusCode);
		if (!error && response.statusCode === 200) {
  			var access_token = body.access_token,
				refresh_token = body.refresh_token;
  
			var options = {
				url: 'https://api.spotify.com/v1/me',
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};

			// use the access token to access the Spotify Web API
			request.get(options, function(error, response, body) {
				console.log(body);
			});
			
			res.render('index');
		}
	})	
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

/*app.post('/', function (req, res) {
	res.render('index');

	//Get inputted artist from text field
	var artist = req.body.artist;

	//TODO: make and call a method that converts artist into artistFormatted

	//TODO: call method in auth.js to get info about the artist from Spotify API.
})*/

app.listen(port, function () {
	console.log(`GreatestHits listening on port ${port}`)
})