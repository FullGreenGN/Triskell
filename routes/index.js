const express = require('express');
const router = express.Router();
const db = require('../db');
const config = require('../config.json');

const axios = require('axios');

router.get('/', async function(req, res) {
    try {
        // Fetch weather data using axios
        const weatherResponse = await axios.get('http://api.weatherapi.com/v1/current.json', {
            params: {
                key: config.weatherApiKey,
                q: config.weatherCity,
                lang: 'fr',
            }
        });
        
        const forecast = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
            params: {
                key: config.weatherApiKey,
                q: config.weatherCity,
                days: 3,
                lang: 'fr',
            }
        });

        const weatherData = weatherResponse.data;
        const forecastData = forecast.data;

        console.log(weatherData.location.name + " " + weatherData.current.temp_c + "°C");
        console.log(forecastData.forecast.forecastday[0].day.maxtemp_c + "°C");

        for (let i = 0; i < forecastData.forecast.forecastday.length; i++) {
            const day = forecastData.forecast.forecastday[i];
            console.log(day.date + " " + day.day.maxtemp_c + "°C");
        }

        res.render('index', {
            profs: await db.missings.findAll({ limit: 30 }),

            weatherData: weatherData,
            forecastData: forecastData,
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;