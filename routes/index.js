var express = require('express');
var passport = require('passport');
var router = express.Router();

// other modules
var homeRoute = require("./home");
var requirementsRoute = require("./requirements");
var chatRoomRoute = require("./chat-room");
var issueLogRoute = require("./issue-log");
var loginRoute = require("./login");

// router specs
router.get('/', homeRoute);
router.get('/requirements', ensureAuthenticated, requirementsRoute);
router.get('/chat-room', ensureAuthenticated, chatRoomRoute);
router.get('/issue-log', ensureAuthenticated, issueLogRoute);
router.get('/login', loginRoute);
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}
