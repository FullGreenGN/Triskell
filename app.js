const colors = require("colors"); // pour avoir une belle console


// instant advertising
console.log(
    " ╔═══════════════════════════════════════════════════════════╗".brightCyan
);
console.log(
    " ║            Triskell NodeJs server by FullGreen.GN         ║".brightCyan
);
console.log(
    " ╚═══════════════════════════════════════════════════════════╝".brightCyan
);

const bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let morgan = require("morgan");
let path = require("path");

let bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");
const flash = require("flash");
const express = require("express");

const SelfReloadJSON = require("self-reload-json");

function loadApp() {
    const config = new SelfReloadJSON("./config.json");
    const debug = config.debug;

    const app = express();
    const http = require("http").createServer(app);

    const port = process.env.PORT || config.port;

    app.use("/", express.static("public"));

    app.use(cookieParser(config.secret));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
        expressSession({
            secret: config.secret,
            resave: false,
            saveUninitialized: false,
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());


    if (debug)
        app.use(
            morgan(
                "[" +
                "DEBUG".magenta +
                "] " +
                "[" +
                "REQUEST".green +
                "] " +
                ":method :url :status :res[content-length] - :response-time ms"
            )
        );

    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    app.use("/admin", require("./routes/dashboard"));
    app.use("/", require("./routes/index"));

    passport.use(
        new LocalStrategy(function(username, password, done) {
            let user = {
                username: "user",
                passwordHash: config.passwordHash,
                id: 1,
            };

            if (debug)
                utils.logDebug("[" + "AUTH".red + "] " + "je cherche " + username);
            if (user.username == "user") {
                if (debug)
                    utils.logDebug(
                        "[" + "AUTH".red + "] " + "User trouvé: " + user.toString
                    );
                // User not found
                if (!user) {
                    if (debug)
                        utils.logDebug(
                            "[" + "AUTH".red + "] " + "je ne trouve pas " + user
                        );
                    return done(null, false);
                }

                // Always use hashed passwords and fixed time comparison
                bcrypt.compare(password, user.passwordHash, (err, isValid) => {
                    if (err) {
                        return done(err);
                    }
                    if (!isValid) {
                        if (debug)
                            utils.logDebug(
                                "[" + "AUTH".red + "] " + "mdp de " + user.username + " faux"
                            );
                        return done(null, false), { message: "Incorrect password." };
                    }
                    if (debug)
                        utils.logDebug(
                            "[" + "AUTH".red + "] " + "mdp de " + user.username + " validé"
                        );
                    return done(null, user);
                });
            } else {
                if (debug)
                    utils.logDebug(
                        "[" + "AUTH".red + "] " + "Je ne trouve pas " + username
                    );
                return done("user not found");
            }
        })
    );

    passport.serializeUser(function(user, done) {
        if (debug)
            utils.logDebug(
                "[" + "AUTH".red + "] " + "sérialise l'user " + user.username
            );
        done(null, user);
    });

    passport.deserializeUser(function(testuser, done) {
        let user = {
            username: "user",
            passwordHash: config.passwordHash,
            id: 1,
        };

        if (debug)
            utils.logDebug(
                "[" + "AUTH".red + "] " + "désérialise l'user " + testuser.username
            );

        if (user.username == testuser.username) {
            done(null, user);
        } else {
            if (debug)
                utils.logDebug("[" + "AUTH".red + "] " + "décé user pas trouvé");
            done("cc", user);
        }
    });

    app.get("/login", function(req, res) {
        if (req.session.passport !== undefined) {
            res.redirect("/admin");
        } else {
            let hasPass = true;
            if (config.passwordHash == "") hasPass = false;
            res.render("login", {
                message: "",
                messageType: "success",
                hasPass: hasPass,
            });
        }
    });

    app.post("/login", function(req, res, next) {
        passport.authenticate("local", function(err, user, info) {
            if (err) {
                console.log(err);
                return next(err);
            }

            let hasPass = false;
            if (!config.passwordHash == "") hasPass = true;

            console.log(hasPass);

            if (!user) {
                console.log("user not found");
                return res.render("login", {
                    message: "Wrong password",
                    messageType: "error",
                    hasPass: hasPass,
                });
            }
            req.logIn(user, function(err) {
                console.log("login");
                if (err) {
                    return next(err);
                }
                return res.redirect("/admin");
            });
        })(req, res, next);
    });

    http.listen(port, () => {
        console.log("[STARTING] App started on port ".brightCyan + port);
    });
}

module.exports = {
    loadApp,
};