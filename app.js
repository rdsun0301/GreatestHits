const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express()
const convertArtist = require('./lib/convertArtist');

//Stored values in .env file
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const port = 3000;

var options = null;

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
  
			options = {
				url: 'https://api.spotify.com/v1/search?q=',
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};
			
			res.render('index');
		} else {
			//TODO: display error that something went wrong... when it shouldn't have.
		}
	})	
})

app.post('/', function (req, res) {
	//Get inputted artist from text field
	var artist = req.body.artist;

	var artistFormatted = convertArtist(artist);

	//append artistFormatted to the end of the search url.
	options.url += artistFormatted;
	//only want first search result
	options.url += '&type=artist&offset=0&limit=1'

	//Get artist info from Spotify database
	request.get(options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var artistID = body.artists.items[0].id;
			
			res.render('index');
		}
	})	
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