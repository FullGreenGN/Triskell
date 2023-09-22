const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async function(req, res) {
    res.render('index', {
        profs: await db.missings.findAll({ limit: 30 }),

        weatherSectionTitle: "Metéo",
        weatherData: {
        	city: "Perpignan",
            weather: "IL FAIT BEAU IL FAIT CHAUD"
        },
        
        ephemerideSectionTitle: "Ephemeride",
        ephemerideData: {
        	sentence: "AUJOURD'HUI C EST LA SAINT HUGETTE"
        },
    });
});

module.exports = router;