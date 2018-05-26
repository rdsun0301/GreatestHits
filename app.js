const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express()
const convertArtist = require('./lib/convertArtist');

//Stored values in .env file
require('dotenv').config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT;

var options = null;
var artistObject = {
	artistName: null,
	artistFollowers: null,
	artistImg: null,
	artistPopularity: null,
	artistAlbums: null,
	artistTracks: null,
	error: null
}

//Pass this object to get back to main page.
const dummyObject = {
	artistName: null,
	artistFollowers: null,
	artistImg: null,
	artistPopularity: null,
	artistAlbums: null,
	artistTracks: null,
	error: null
}

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
  			var access_token = body.access_token,
				refresh_token = body.refresh_token;
  
			options = {
				url: 'https://api.spotify.com/v1/search?q=',
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};
			
			res.render('index', dummyObject);
		} else {
			//TODO: error, something weird happened that shouldn't have
		}
	})	
})

app.post('/search', function (req, res) {
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
			//Get artistID to get top hit data.
			var artistID = body.artists.items[0].id;

			//Create object to eventually pass to front end
			artistObject = {
				artistName: body.artists.items[0].name,
				artistFollowers: body.artists.items[0].followers.total,
				artistImg: body.artists.items[0].images[0].url,
				artistPopularity: body.artists.items[0].popularity,
				artistAlbums: null,
				artistTracks: null
			}

			//Ceate object to pass to Spotify, searching for artist data
			var artistSearch = {
				url:'https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?country=US',
				headers: options.headers,
				json: true
			}
			
			request.get(artistSearch, function(error, response, body) {
				//How many hits are there?
				var listLength = Object.keys(body.tracks).length;

				//Get the top hits
				for(let i = 0; i < listLength; i++) {
					console.log(body.tracks[i].name);
					console.log(body.tracks[i].preview_url);
					console.log(body.tracks[i].popularity);
				}
			})

			res.render('index', artistObject);
		} else {
			//TODO: error, invalid user input
		}
	})	
})

app.listen(PORT, function () {
	console.log(`GreatestHits listening on port ${PORT}`)
})