const express = require("express");
const router = express.Router();
const db = require("../db");

const package = require("../package.json");

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
    if (req.session.passport == undefined) {
        res.redirect("/login");
    } else {
        res.render("admin/infos", {
            currentURL: req.originalUrl,
            title: "Infos",
            user: req.user,
            version: package.version,
            update: {
                version: "1.0.0",
                date: "2021-01-01",

                need: true
            }
        });
    }
});

module.exports = router;
