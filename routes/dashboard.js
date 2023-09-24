const express = require("express");
const router = express.Router();
const db = require("../db");

const colors = require("colors");

const fs = require('fs');
const request = require('request');
const decompress = require('decompress');

const package = require("../package.json");
const config = require("../config.json")

router.get("/", async function (req, res) {
    if (req.session.passport == undefined) {
        res.redirect("/login");
    } else {
        res.render("admin/dashboard", {
            currentURL: req.originalUrl,
            title: "Dashboard",
            user: req.user,
            professors: await db.missings.findAll({
                limit: 30,
            }),
        });
    }
});

router.get("/professors", async function (req, res) {
    if (req.session.passport == undefined) {
        res.redirect("/login");
    } else {
        res.render("admin/professor", {
            currentURL: req.originalUrl,
            title: "Professor",
            user: req.user,
            profs: await db.missings.findAll({
                limit: 30,
            }),
        });
    }
});

router.post("/professor/post", async function (req, res) {
    const name = req.body.name;
    const matter = req.body.matter;
    const from = req.body.from;
    const to = req.body.to;

    // insert new missing
    await db.missings.create({
        name: name,
        matter: matter,
        from: from,
        to: to,
    });

    res.redirect("/dashboard/professors");
});

router.post("/professor/delete", async function (req, res) {
    const id = req.body.id;
    await db.missings.destroy({
        where: {
            name: id,
        },
    });

    res.redirect("/dashboard/professors");
});

router.get("/infos", async function (req, res) {
    const package = require("../package.json");
    const request = require("request");

    request.get('https://raw.githubusercontent.com/FullGreenGN/Triskell/main/package.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var version = body;

            packageData = JSON.parse(body);

            if(package.version > packageData.version) {
                var update = {
                    current: package.version,
                    need: false,
                    version: packageData.version,
                    url: ""
                };
            } else {
                var update = {
                    current: package.version,
                    need: version !== package.version,
                    version: packageData.version,
                    url: body.url
                };
            }
            

            if (req.session.passport == undefined) {
                res.redirect("/login");
            } else {
                res.render("admin/infos", {
                    currentURL: req.originalUrl,
                    title: "Infos",
                    user: req.user,
                    version: package.version,
                    update: update,
                });
            }
        } else {
            var update = {
                current: package.version,
                need: false,
                version: package.version,
                url: ""
            };

            if (req.session.passport == undefined) {
                res.redirect("/login");
            } else {
                res.render("admin/infos", {
                    currentURL: req.originalUrl,
                    title: "Infos",
                    user: req.user,
                    version: package.version,
                    update: update,
                });
            }
        }
    });
});

router.get("/settings", async function (req, res) {
    if (req.session.passport == undefined) {
        res.redirect("/login");
    } else {
        res.render("admin/settings", {
            currentURL: req.originalUrl,
            title: "Settings",
            user: req.user,

            weatherApiKey: config.weatherApiKey,
        });
    }
});

router.post("/settings/post", async function (req, res) {
    const weather = req.body.weather;

    // add weather to json
    var json = require("../config.json");
    json.weatherApiKey = weather;

    // write json
    fs.writeFile("../config.json", JSON.stringify(json), function (err) {
        if (err) return console.log(err);
    });

    res.redirect("/dashboard/settings");
});

router.get('/update', async function (req, res) {
    if (req.session.passport == undefined) {
        res.redirect("/login");
    } else {
        request.get('https://raw.githubusercontent.com/FullGreenGN/Triskell/main/package.json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                packageData = JSON.parse(body);

                request.get('https://github.com/FullGreenGN/Triskell/archive/refs/tags/v' + packageData.version + '.zip')
                    .pipe(fs.createWriteStream('update.zip'))
                    .on('finish', function () {
                        decompress('update.zip', __dirname + '/../tmp')
                            .then((files) => {
                                console.log('Extraction complete ! Welcome to v' + packageData.version + ' !'.green);

                                // Now, you can redirect the client after extraction is complete
                                res.redirect('/dashboard/infos');
                            })
                            .catch((err) => {
                                console.log(err);

                                res.status(500).send('Error occurred during extraction');
                            });
                    });
            }
        });
    }
});





module.exports = router;
