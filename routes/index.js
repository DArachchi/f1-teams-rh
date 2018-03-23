// Dependencies
var express = require("express");
var passport = require("passport");
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require('request');

var env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
};
  

// Requiring team model
var Team = require("../models/team.js");

// Set up routes
router.get('/', function(req,res) {
    res.send('This is the homepage');
});

router.get('/login', passport.authenticate('auth0', {
    clientId: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    responseType: 'code',
    scope: 'openid profile email'
    }), function(req,res) {
    res.send('This is the login page')
});

router.get('/logout', function(req,res) {
    req.logout();
    res.redirect('/');
});

router.get('/teams', ensureLoggedIn, function(req,res) {
	Team.find({}, function(error, teams) {
		if (error) {
			res.send(error);
		}
		else {
			res.json(teams);
		}
	})
});

router.get('/user', function(req,res) {
    res.send('This is the user page')
});

router.get('/callback', passport.authenticate('auth0',
    {failureRedirect: 'url-if-something-fails'}), function(req,res) {
        res.redirect(req.session.returnTo || '/teams');
});

module.exports = router;