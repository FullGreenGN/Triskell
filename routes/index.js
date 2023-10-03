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

        res.render('index', {
            profs: await db.missings.findAll({ limit: 30 }),

            weatherCritical: config.weatherCritical,
            weatherData: weatherData,
            forecastData: forecastData,
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;