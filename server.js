const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '839330a97feb4fa9c67886e2f1bd5a6e';
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let units = 'metric';
    let unitsLetter = 'C';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`

    request(url, function (err, reponse, body) {
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
    });
  })

app.listen(port, function () {
  console.log(`GreatestHits listening on port ${port}`)
})