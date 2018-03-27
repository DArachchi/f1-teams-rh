// Dependencies
var express = require("express");
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

var env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
};
  

// Requiring team model
var Team = require("../models/team.js");

// Set up routes
router.get('/', function(req,res) {
    res.render('index', {env: env});
});

router.get('/login', function(req,res) {
        res.render('login', { env: env});
});

router.get('/logout', function (req, res){
    var redirectUrl = 'https://f1-sso.auth0.com/v2/logout?returnTo=http%3A%2F%2Fwww.google.com&client_id=' + env.AUTH0_CLIENT_ID;

    res.redirect(redirectUrl);
});

router.get('/teams', ensureLoggedIn, function(req,res) {
	Team.find({}, function(error, data) {
		if (error) {
			res.send(error);
		}
		else {
            data = JSON.stringify(data);
            data = JSON.parse(data);
            res.render('teams', {user: req.user, teams: data});
		}
	})
});

router.get('/callback', function(req,res) {
        res.redirect(req.session.returnTo || '/teams');
});

module.exports = router;