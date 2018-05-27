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
const WEBSITE_URL = process.env.WEBSITE_URL;

var options = null;
var artistObject = {
	artistName: null,
	artistFollowers: null,
	artistImg: null,
	artistPopularity: null,
	artistAlbums: null,
	artistTracks: null,
	siteURL: WEBSITE_URL,
	error: null
}

//Pass this object to get back to main page.
const dummyObject = {
	artistName: null,
	artistFollowers: null,
	artistImg: null,
	artistPopularity: null,
	artistAlbums: [],
	artistTracks: [],
	siteURL: WEBSITE_URL,
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

app.get('/search', function (req, res) {
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
			
			res.render('index', artistObject);
		} else {
			//TODO: error, something weird happened that shouldn't have
		}
	})	
})

app.post('/search', function (req, res) {
	//Get inputted artist from text field
	var artist = req.body.artist;
	var artistFormatted = convertArtist(artist);

	//reset search url
	options.url = 'https://api.spotify.com/v1/search?q='
	//append artistFormatted to the end of the search url.
	options.url += artistFormatted;
	//only want first search result
	options.url += '&type=artist&offset=0&limit=1'
	
	//Get artist info from Spotify database
	request.get(options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			//Get artistID to get top hit data.
			var artistID = body.artists.items[0].id;

			//Modify object to eventually pass to front end
			artistObject.artistName = body.artists.items[0].name;
			artistObject.artistFollowers = body.artists.items[0].followers.total;
			artistObject.artistImg = body.artists.items[0].images[0].url;
			artistObject.artistPopularity = body.artists.items[0].popularity;
			artistObject.artistAlbums = null;
			artistObject.artistTracks = null;
			artistObject.error = null;

			//Ceate object to pass to Spotify, searching for artist data
			var artistSearch = {
				url:'https://api.spotify.com/v1/artists/' + artistID + '/albums?include_groups=album&market=US',
				headers: options.headers,
				json: true
			}
			
			//Get top albums
			artistObject.artistAlbums = [];
			request.get(artistSearch, function(error, response, body) {
				//How many albums are there?
				var listLength = Object.keys(body.items).length;
				
				for(let i = 0; i < listLength; i++) {
					//Get album name, art, link, release date.
					var album = {
						name: body.items[i].name,
						img: body.items[i].images[0].url,
						url: body.items[i].external_urls.spotify,
						release: body.items[i].release_date
					}
					
					artistObject.artistAlbums.push(album);
				}
			})

			//Get top tracks
			artistObject.artistTracks = [];
			artistSearch.url = 'https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?country=US';
			request.get(artistSearch, function(error, response, body) {
				//How many tracks are there?
				var listLength = Object.keys(body.tracks).length;

				for(let i = 0; i < listLength; i++) {
					//TODO: get track names, preview urls, popularities.
					var track = {
						name: body.tracks[i].name,
						url: body.tracks[i].preview_url,
						popularity: body.tracks[i].popularity
					}
					
					artistObject.artistTracks.push(track);
				}
			})
			
			//Make sure this happens after the data is retrieved.
			setTimeout(function() {
				res.render('index', artistObject);
			}, 500);
		} else {
			//TODO: error, invalid user input
		}
	})	
})

app.listen(PORT, function () {
	console.log(`GreatestHits listening on port ${PORT}`)
})