const request = require('request');

//From registering Spotify app
const clientID = '0cc85a786e754b958fa0096973baf894';
const clientSecret = 'd37be6a43f724ba1ae4b5fc02b8b8ac7';

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

request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
		var artistFormatted = null;
		
        //Uses the access code to perform search
        var token = body.access_token;
        var options = {
            url: 'https://api.spotify.com/v1/search?q=' + artistFormatted,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
        };
        //This should return info about the searched artist
        request.get(options, function(error, response, body) {
            console.log(body);
        });
    }
});

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