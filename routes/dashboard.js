const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
    if (req.session.passport == undefined) {
        res.redirect("/login");
    } else {
        res.render("dashboard", {
            title: "Dashboard",
            user: req.user,
        });
    }
});

module.exports = router;